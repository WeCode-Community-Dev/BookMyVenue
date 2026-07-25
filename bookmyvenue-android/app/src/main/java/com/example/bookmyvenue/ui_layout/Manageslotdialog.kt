package com.example.bookmyvenue.ui_layout

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bookmyvenue.data.BackendVenueItem
import com.example.bookmyvenue.data.OwnerDashboardViewModel
import com.example.bookmyvenue.data.VenueSlotDto
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

data class CalendarDayItem(
    val dayName: String,
    val dayNumber: String,
    val fullDate: Date
)

enum class RepeatTypeOption(val value: String) {
    NONE("NONE"),
    DAILY("DAILY"),
    WEEKLY("WEEKLY")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ManageSlotsDialog(
    venue: BackendVenueItem,
    viewModel: OwnerDashboardViewModel,
    onDismiss: () -> Unit
) {
    val brandRed = Color(0xFFE51E26)
    val context = LocalContext.current

    val next14Days = remember {
        val list = mutableListOf<CalendarDayItem>()
        val cal = Calendar.getInstance()
        val dayFormat = SimpleDateFormat("EEE", Locale.US)
        val numFormat = SimpleDateFormat("dd", Locale.US)

        for (i in 0..13) {
            val date = cal.time
            list.add(
                CalendarDayItem(
                    dayName = dayFormat.format(date).uppercase(),
                    dayNumber = numFormat.format(date),
                    fullDate = date
                )
            )
            cal.add(Calendar.DAY_OF_YEAR, 1)
        }
        list
    }

    var selectedDateItem by remember { mutableStateOf(next14Days.first()) }
    var startHour by remember { mutableStateOf(10) }
    var startMinute by remember { mutableStateOf(0) }
    var endHour by remember { mutableStateOf(11) }
    var endMinute by remember { mutableStateOf(0) }

    var startTimeText by remember { mutableStateOf("10:00 AM") }
    var endTimeText by remember { mutableStateOf("11:00 AM") }
    var baseHourlyPriceInput by remember { mutableStateOf(venue.pricePerHour.toString()) }

    var selectedRepeatOption by remember { mutableStateOf(RepeatTypeOption.NONE) }
    var repeatUntilCalendar by remember {
        mutableStateOf(Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, 7) })
    }
    var repeatUntilText by remember {
        mutableStateOf(SimpleDateFormat("dd MMM yyyy", Locale.getDefault()).format(repeatUntilCalendar.time))
    }

    var slotsList by remember { mutableStateOf<List<VenueSlotDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var isCreatingSlot by remember { mutableStateOf(false) }

    // State for Slot Deletion Confirmation Dialog
    var slotToDelete by remember { mutableStateOf<VenueSlotDto?>(null) }

    fun refreshSlots() {
        isLoading = true
        viewModel.fetchSlotsForVenue(
            venueId = venue.id,
            onResult = { slots ->
                slotsList = slots
                isLoading = false
            },
            onError = {
                isLoading = false
            }
        )
    }

    LaunchedEffect(venue.id) {
        refreshSlots()
    }

    fun openStartTimePicker() {
        TimePickerDialog(context, { _, hour, minute ->
            startHour = hour
            startMinute = minute
            val cal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour)
                set(Calendar.MINUTE, minute)
            }
            startTimeText = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(cal.time)
        }, startHour, startMinute, false).show()
    }

    fun openEndTimePicker() {
        TimePickerDialog(context, { _, hour, minute ->
            endHour = hour
            endMinute = minute
            val cal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour)
                set(Calendar.MINUTE, minute)
            }
            endTimeText = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(cal.time)
        }, endHour, endMinute, false).show()
    }

    fun openRepeatUntilDatePicker() {
        DatePickerDialog(
            context,
            { _, year, month, dayOfMonth ->
                repeatUntilCalendar = Calendar.getInstance().apply {
                    set(Calendar.YEAR, year)
                    set(Calendar.MONTH, month)
                    set(Calendar.DAY_OF_MONTH, dayOfMonth)
                    set(Calendar.HOUR_OF_DAY, 23)
                    set(Calendar.MINUTE, 59)
                }
                repeatUntilText = SimpleDateFormat("dd MMM yyyy", Locale.getDefault()).format(repeatUntilCalendar.time)
            },
            repeatUntilCalendar.get(Calendar.YEAR),
            repeatUntilCalendar.get(Calendar.MONTH),
            repeatUntilCalendar.get(Calendar.DAY_OF_MONTH)
        ).show()
    }

    val filteredSlots = remember(slotsList, selectedDateItem) {
        val localDayFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val selectedDayStr = localDayFormat.format(selectedDateItem.fullDate)

        slotsList.filter { slot ->
            try {
                val isoFmt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                    timeZone = TimeZone.getTimeZone("UTC")
                }
                val date = isoFmt.parse(slot.startTime)
                val slotDayStr = localDayFormat.format(date!!)
                slotDayStr == selectedDayStr
            } catch (e: Exception) {
                false
            }
        }
    }

    // Confirmation Dialog before deleting
    slotToDelete?.let { slot ->
        AlertDialog(
            onDismissRequest = { slotToDelete = null },
            title = { Text("Delete Time Slot?", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to remove this time slot? Users will no longer be able to book it.", fontSize = 13.sp) },
            confirmButton = {
                Button(
                    onClick = {
                        val targetId = slot.id
                        slotToDelete = null
                        viewModel.deactivateSlot(
                            slotId = targetId,
                            onSuccess = {
                                Toast.makeText(context, "Slot removed successfully", Toast.LENGTH_SHORT).show()
                                refreshSlots()
                            },
                            onError = { err ->
                                Toast.makeText(context, err, Toast.LENGTH_SHORT).show()
                            }
                        )
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                ) {
                    Text("Delete", color = Color.White, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { slotToDelete = null }) {
                    Text("Cancel", color = Color.Gray)
                }
            }
        )
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text("Configure Venue Slots", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text(venue.name, fontSize = 12.sp, color = Color.Gray)
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .wrapContentHeight(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text("Select Slot Date", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(next14Days) { dayItem ->
                        val isSelected = dayItem == selectedDateItem
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = if (isSelected) brandRed else Color(0xFFF1F5F9),
                            modifier = Modifier
                                .width(54.dp)
                                .clickable { selectedDateItem = dayItem }
                        ) {
                            Column(
                                modifier = Modifier.padding(vertical = 8.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Text(
                                    text = dayItem.dayName,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) Color.White else Color.Gray
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = dayItem.dayNumber,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) Color.White else Color(0xFF1A1A1A)
                                )
                            }
                        }
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            OutlinedButton(
                                onClick = { openStartTimePicker() },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Start Time", fontSize = 10.sp, color = Color.Gray)
                                    Text(startTimeText, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A1A1A))
                                }
                            }

                            OutlinedButton(
                                onClick = { openEndTimePicker() },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("End Time", fontSize = 10.sp, color = Color.Gray)
                                    Text(endTimeText, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A1A1A))
                                }
                            }
                        }

                        OutlinedTextField(
                            value = baseHourlyPriceInput,
                            onValueChange = { baseHourlyPriceInput = it },
                            label = { Text("Base Hourly Price (₹)") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        Text("Recurring Pattern", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            RepeatTypeOption.values().forEach { option ->
                                FilterChip(
                                    selected = selectedRepeatOption == option,
                                    onClick = { selectedRepeatOption = option },
                                    label = { Text(option.name, fontSize = 11.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = brandRed,
                                        selectedLabelColor = Color.White
                                    ),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }

                        if (selectedRepeatOption != RepeatTypeOption.NONE) {
                            OutlinedButton(
                                onClick = { openRepeatUntilDatePicker() },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("Repeat Until Date:", fontSize = 12.sp, color = Color.Gray)
                                    Text(repeatUntilText, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = brandRed)
                                }
                            }
                        }

                        Button(
                            onClick = {
                                val priceVal = baseHourlyPriceInput.toDoubleOrNull()
                                if (priceVal == null || priceVal <= 0) {
                                    Toast.makeText(context, "Please enter a valid price", Toast.LENGTH_SHORT).show()
                                    return@Button
                                }

                                val startCal = Calendar.getInstance().apply {
                                    time = selectedDateItem.fullDate
                                    set(Calendar.HOUR_OF_DAY, startHour)
                                    set(Calendar.MINUTE, startMinute)
                                    set(Calendar.SECOND, 0)
                                    set(Calendar.MILLISECOND, 0)
                                }

                                val endCal = Calendar.getInstance().apply {
                                    time = selectedDateItem.fullDate
                                    set(Calendar.HOUR_OF_DAY, endHour)
                                    set(Calendar.MINUTE, endMinute)
                                    set(Calendar.SECOND, 0)
                                    set(Calendar.MILLISECOND, 0)
                                }

                                if (endCal.before(startCal) || endCal.equals(startCal)) {
                                    Toast.makeText(context, "End time must be after start time", Toast.LENGTH_SHORT).show()
                                    return@Button
                                }

                                if (startCal.time.before(Date())) {
                                    Toast.makeText(context, "Slot start time must be in the future", Toast.LENGTH_SHORT).show()
                                    return@Button
                                }

                                val isoFormatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                    timeZone = TimeZone.getTimeZone("UTC")
                                }

                                val startIso = isoFormatter.format(startCal.time)
                                val endIso = isoFormatter.format(endCal.time)

                                isCreatingSlot = true
                                viewModel.createSlotForVenue(
                                    venueId = venue.id,
                                    startTimeIso = startIso,
                                    endTimeIso = endIso,
                                    price = priceVal,
                                    onSuccess = {
                                        isCreatingSlot = false
                                        Toast.makeText(context, "Slot created successfully!", Toast.LENGTH_SHORT).show()
                                        refreshSlots()
                                    },
                                    onError = { err ->
                                        isCreatingSlot = false
                                        val errorMsg = if (err.contains("overlap", ignoreCase = true) || err.contains("400") || err.contains("Bad Request", ignoreCase = true)) {
                                            "Failed: This time slot overlaps with an existing one."
                                        } else {
                                            err
                                        }
                                        Toast.makeText(context, errorMsg, Toast.LENGTH_LONG).show()
                                    }
                                )
                            },
                            enabled = !isCreatingSlot,
                            colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            if (isCreatingSlot) {
                                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                            } else {
                                Text("Generate Slots", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f))

                Text(
                    text = "Existing Slots for ${selectedDateItem.dayName} ${selectedDateItem.dayNumber}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )

                if (isLoading) {
                    Box(modifier = Modifier.fillMaxWidth().height(40.dp), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = brandRed, modifier = Modifier.size(20.dp))
                    }
                } else if (filteredSlots.isEmpty()) {
                    Text("No slots configured for this date.", fontSize = 11.sp, color = Color.Gray)
                } else {
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(filteredSlots) { slot ->
                            val isBooked = (slot.bookings ?: emptyList()).any {
                                it.status.equals("CONFIRMED", ignoreCase = true) || it.status.equals("PENDING_PAYMENT", ignoreCase = true)
                            }

                            val slotTimeText = remember(slot.startTime, slot.endTime) {
                                try {
                                    val isoFmt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                        timeZone = TimeZone.getTimeZone("UTC")
                                    }
                                    val start = isoFmt.parse(slot.startTime)
                                    val end = isoFmt.parse(slot.endTime)
                                    val timeFmt = SimpleDateFormat("hh:mm a", Locale.getDefault())
                                    "${timeFmt.format(start!!)} - ${timeFmt.format(end!!)}"
                                } catch (e: Exception) {
                                    "N/A"
                                }
                            }

                            val cardBgColor = when {
                                isBooked -> Color(0xFFE2E8F0)
                                slot.isActive -> Color.White
                                else -> Color(0xFFF1F5F9)
                            }

                            val badgeBgColor = when {
                                isBooked -> Color(0xFFCBD5E1)
                                slot.isActive -> Color(0xFFE6F4EA)
                                else -> Color(0xFFF1F5F9)
                            }

                            val badgeFgColor = when {
                                isBooked -> Color(0xFF475569)
                                slot.isActive -> Color(0xFF137333)
                                else -> Color.Gray
                            }

                            val statusTagText = when {
                                isBooked -> "BOOKED"
                                slot.isActive -> "ACTIVE"
                                else -> "INACTIVE"
                            }

                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = cardBgColor,
                                border = BorderStroke(0.5.dp, Color.LightGray)
                            ) {
                                Row(
                                    modifier = Modifier.padding(start = 10.dp, top = 6.dp, bottom = 6.dp, end = if (!isBooked && slot.isActive) 4.dp else 10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column(horizontalAlignment = Alignment.Start) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                                        ) {
                                            Text(
                                                text = slotTimeText,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = if (isBooked) Color(0xFF64748B) else Color(0xFF1A1A1A)
                                            )
                                            Surface(
                                                shape = RoundedCornerShape(4.dp),
                                                color = badgeBgColor
                                            ) {
                                                Text(
                                                    text = statusTagText,
                                                    fontSize = 8.sp,
                                                    color = badgeFgColor,
                                                    fontWeight = FontWeight.Bold,
                                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                                )
                                            }
                                        }
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(
                                            text = "₹${slot.price}",
                                            fontSize = 11.sp,
                                            color = if (isBooked) Color(0xFF64748B) else brandRed,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }


                                    if (!isBooked && slot.isActive) {
                                        Spacer(modifier = Modifier.width(4.dp))
                                        IconButton(
                                            onClick = { slotToDelete = slot },
                                            modifier = Modifier.size(24.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Delete,
                                                contentDescription = "Delete Slot",
                                                tint = Color(0xFF64748B),
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Close", color = brandRed, fontWeight = FontWeight.Bold)
            }
        }
    )
}