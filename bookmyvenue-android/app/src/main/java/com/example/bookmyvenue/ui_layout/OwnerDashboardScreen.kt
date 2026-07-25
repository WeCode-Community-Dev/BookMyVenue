package com.example.bookmyvenue.ui_layout

import android.location.Geocoder
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.bookmyvenue.data.BookingViewModel
import com.example.bookmyvenue.data.OwnerDashboardViewModel
import com.example.bookmyvenue.data.OwnerUiState
import com.example.bookmyvenue.data.VenueSlotDto
import com.google.android.gms.maps.model.LatLng
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

data class OwnerVenueItem(
    val id: String,
    val name: String,
    val location: String,
    val pricePerHour: Double,
    val category: String,
    val status: String,
    val rejectReason: String? = null,
    val isListed: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OwnerDashboardScreen(
    viewModel: OwnerDashboardViewModel,
    bookingViewModel: BookingViewModel,
    onLogoutClick: () -> Unit,
    onToggleListing: (venueId: String, currentStatus: Boolean) -> Unit,
    onVenueClick: (venueId: String) -> Unit = {},
    onNavigateToBookingsAndPayments: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var currentTab by remember { mutableIntStateOf(0) }
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)

    LaunchedEffect(currentTab) {
        when (currentTab) {
            0 -> viewModel.fetchOwnerDashboardData()
            2 -> viewModel.fetchOwnerOverview()
            3 -> {
                viewModel.fetchOwnerDashboardData()
                viewModel.fetchOwnerOverview()
            }
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = "BookMyVenue",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = brandDarkText
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color.White,
                tonalElevation = 0.dp,
                modifier = Modifier.border(width = 0.5.dp, color = Color.LightGray.copy(alpha = 0.4f))
            ) {
                NavigationBarItem(
                    selected = currentTab == 0,
                    onClick = { currentTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Venues") },
                    label = { Text("My Venues", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
                NavigationBarItem(
                    selected = currentTab == 1,
                    onClick = { currentTab = 1 },
                    icon = { Icon(Icons.Default.Add, contentDescription = "Add Venue") },
                    label = { Text("Add Venue", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
                NavigationBarItem(
                    selected = currentTab == 2,
                    onClick = { currentTab = 2 },
                    icon = { Icon(Icons.Default.Info, contentDescription = "Bookings") },
                    label = { Text("Bookings", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
                NavigationBarItem(
                    selected = currentTab == 3,
                    onClick = { currentTab = 3 },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(lightCanvasBg)
        ) {
            when (val state = viewModel.ownerUiState) {
                is OwnerUiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = brandRed)
                    }
                }
                is OwnerUiState.Success -> {
                    when (currentTab) {
                        0 -> OwnerVenuesTab(
                            viewModel = viewModel,
                            venues = state.venues,
                            brandRed = brandRed,
                            brandDarkText = brandDarkText,
                            onToggleListing = onToggleListing,
                            onVenueClick = onVenueClick
                        )
                        1 -> AddVenueTab(viewModel = viewModel, brandRed = brandRed, brandDarkText = brandDarkText, categories = state.categories, onFormSuccessNavigation = { currentTab = 0 })
                        2 -> OwnerBookingsAndPaymentsScreen(viewModel = viewModel)
                        3 -> OwnerProfileTab(
                            userName = state.userName,
                            userEmail = state.userEmail,
                            onLogoutClick = onLogoutClick,
                            brandRed = brandRed,
                            brandDarkText = brandDarkText,
                            venues = state.venues,
                            viewModel = viewModel
                        )
                    }
                }
                is OwnerUiState.Error -> {
                    Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = state.message, textAlign = TextAlign.Center, color = Color.Gray)
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = { viewModel.fetchOwnerDashboardData() },
                                colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                            ) {
                                Text("Retry", color = Color.White)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun OwnerVenuesTab(
    viewModel: OwnerDashboardViewModel,
    venues: List<OwnerVenueItem>,
    brandRed: Color,
    brandDarkText: Color,
    onToggleListing: (String, Boolean) -> Unit,
    onVenueClick: (String) -> Unit = {}
) {
    var selectedStatusTab by remember { mutableIntStateOf(0) }

    val filteredVenues = remember(selectedStatusTab, venues) {
        when (selectedStatusTab) {
            0 -> venues.filter { it.status == "ACTIVE" }
            1 -> venues.filter { it.status == "PENDING" }
            else -> venues.filter { it.status == "REJECTED" }
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        TabRow(
            selectedTabIndex = selectedStatusTab,
            containerColor = Color.White,
            contentColor = brandRed,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    Modifier.tabIndicatorOffset(tabPositions[selectedStatusTab]),
                    color = brandRed
                )
            }
        ) {
            val activeColor = Color(0xFF10B981)
            val pendingColor = Color(0xFFF59E0B)

            Tab(
                selected = selectedStatusTab == 0,
                onClick = { selectedStatusTab = 0 },
                text = { Text("Active (${venues.count { it.status == "ACTIVE" }})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                selectedContentColor = activeColor,
                unselectedContentColor = Color.Gray
            )
            Tab(
                selected = selectedStatusTab == 1,
                onClick = { selectedStatusTab = 1 },
                text = { Text("Pending (${venues.count { it.status == "PENDING" }})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                selectedContentColor = pendingColor,
                unselectedContentColor = Color.Gray
            )
            Tab(
                selected = selectedStatusTab == 2,
                onClick = { selectedStatusTab = 2 },
                text = { Text("Rejected (${venues.count { it.status == "REJECTED" }})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                selectedContentColor = brandRed,
                unselectedContentColor = Color.Gray
            )
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            if (filteredVenues.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 20.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = when (selectedStatusTab) {
                                    0 -> "No Active Venues"
                                    1 -> "No Pending Applications"
                                    else -> "No Rejected Venues"
                                },
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = brandDarkText
                            )
                            Text(
                                text = when (selectedStatusTab) {
                                    0 -> "Your approved venues open for bookings will appear here."
                                    1 -> "Properties currently awaiting verification from the admin team."
                                    else -> "Venues requiring descriptive adjustments before approval."
                                },
                                fontSize = 13.sp,
                                color = Color.Gray,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            } else {
                items(filteredVenues) { venue ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onVenueClick(venue.id) }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = venue.name,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = brandDarkText,
                                        modifier = Modifier.weight(1f, fill = false)
                                    )

                                    val statusColor = when (venue.status) {
                                        "ACTIVE" -> Color(0xFF10B981)
                                        "REJECTED" -> Color(0xFFEF4444)
                                        else -> Color(0xFFF59E0B)
                                    }

                                    Surface(
                                        color = statusColor.copy(alpha = 0.12f),
                                        shape = RoundedCornerShape(4.dp)
                                    ) {
                                        Text(
                                            text = venue.status,
                                            color = statusColor,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = "Category: ${venue.category}",
                                    fontSize = 13.sp,
                                    color = Color.Gray
                                )
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                if (venue.status == "ACTIVE") {
                                    Box(modifier = Modifier.scale(0.8f)) {
                                        Switch(
                                            checked = venue.isListed,
                                            onCheckedChange = { onToggleListing(venue.id, venue.isListed) },
                                            colors = SwitchDefaults.colors(
                                                checkedThumbColor = Color.White,
                                                checkedTrackColor = Color(0xFF10B981),
                                                uncheckedThumbColor = Color.White,
                                                uncheckedTrackColor = Color.LightGray
                                            )
                                        )
                                    }
                                }

                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowRight,
                                    contentDescription = "View Details",
                                    tint = Color.Gray
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OwnerSlotsManagementDialog(
    venue: OwnerVenueItem,
    viewModel: OwnerDashboardViewModel,
    brandRed: Color,
    brandDarkText: Color,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    var selectedDate by remember { mutableStateOf(Calendar.getInstance().time) }
    var inputPrice by remember { mutableStateOf(venue.pricePerHour.toString()) }
    var selectedStartHour by remember { mutableIntStateOf(9) }
    var selectedEndHour by remember { mutableIntStateOf(11) }
    var activeSlotsList by remember { mutableStateOf(listOf<VenueSlotDto>()) }
    var isFetchingSlots by remember { mutableStateOf(true) }
    var isCreatingSlot by remember { mutableStateOf(false) }

    val datesList = remember {
        val list = mutableListOf<Date>()
        val cal = Calendar.getInstance()
        repeat(7) {
            list.add(cal.time)
            cal.add(Calendar.DAY_OF_YEAR, 1)
        }
        list
    }

    LaunchedEffect(venue.id) {
        viewModel.fetchSlotsForVenue(
            venueId = venue.id,
            onResult = { slots ->
                activeSlotsList = slots
                isFetchingSlots = false
            },
            onError = { msg ->
                isFetchingSlots = false
                Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
            }
        )
    }

    val filteredSlots = remember(selectedDate, activeSlotsList) {
        activeSlotsList.filter { slot ->
            try {
                val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                    timeZone = TimeZone.getTimeZone("UTC")
                }
                val slotDate = isoFormat.parse(slot.startTime)
                if (slotDate != null) {
                    val fmt = SimpleDateFormat("yyyyMMdd", Locale.US)
                    fmt.format(slotDate) == fmt.format(selectedDate)
                } else {
                    false
                }
            } catch (e: Exception) {
                false
            }
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        properties = androidx.compose.ui.window.DialogProperties(usePlatformDefaultWidth = false),
        modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.9f)
            .padding(16.dp),
        content = {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                modifier = Modifier.fillMaxSize()
            ) {
                Column(modifier = Modifier.fillMaxSize()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Configure Slots", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                            Text(venue.name, fontSize = 12.sp, color = Color.Gray)
                        }
                        IconButton(onClick = onDismiss) {
                            Icon(Icons.Default.Close, contentDescription = "Close")
                        }
                    }
                    HorizontalDivider(color = Color.LightGray.copy(alpha = 0.4f))

                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .verticalScroll(rememberScrollState())
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text("1. Select Target Date", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(datesList) { date ->
                                val isSelected = SimpleDateFormat("yyyyMMdd", Locale.US).format(date) ==
                                        SimpleDateFormat("yyyyMMdd", Locale.US).format(selectedDate)
                                Column(
                                    modifier = Modifier
                                        .width(54.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (isSelected) brandRed else Color(0xFFF1F5F9))
                                        .clickable { selectedDate = date }
                                        .padding(vertical = 8.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(
                                        text = SimpleDateFormat("EEE", Locale.US).format(date).uppercase(),
                                        fontSize = 10.sp,
                                        color = if (isSelected) Color.White else Color.Gray,
                                        fontWeight = FontWeight.Medium
                                    )
                                    Text(
                                        text = SimpleDateFormat("dd", Locale.US).format(date),
                                        fontSize = 14.sp,
                                        color = if (isSelected) Color.White else brandDarkText,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        Text("2. Create Time Block", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Start Hour", fontSize = 11.sp, color = Color.Gray)
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(1.dp, Color.LightGray, RoundedCornerShape(6.dp))
                                        .clickable { }
                                        .padding(12.dp)
                                ) {
                                    Text(String.format(Locale.getDefault(), "%02d:00", selectedStartHour), fontSize = 14.sp)
                                }
                                Slider(
                                    value = selectedStartHour.toFloat(),
                                    onValueChange = { selectedStartHour = it.toInt() },
                                    valueRange = 0f..23f,
                                    steps = 23,
                                    colors = SliderDefaults.colors(thumbColor = brandRed, activeTrackColor = brandRed)
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Text("End Hour", fontSize = 11.sp, color = Color.Gray)
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(1.dp, Color.LightGray, RoundedCornerShape(6.dp))
                                        .clickable { }
                                        .padding(12.dp)
                                ) {
                                    Text(String.format(Locale.getDefault(), "%02d:00", selectedEndHour), fontSize = 14.sp)
                                }
                                Slider(
                                    value = selectedEndHour.toFloat(),
                                    onValueChange = { selectedEndHour = it.toInt() },
                                    valueRange = 0f..24f,
                                    steps = 24,
                                    colors = SliderDefaults.colors(thumbColor = brandRed, activeTrackColor = brandRed)
                                )
                            }
                        }

                        OutlinedTextField(
                            value = inputPrice,
                            onValueChange = { inputPrice = it },
                            label = { Text("Slot Specific Pricing (₹)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(6.dp),
                            singleLine = true
                        )

                        Button(
                            onClick = {
                                val priceParsed = inputPrice.toDoubleOrNull()
                                if (priceParsed == null || selectedStartHour >= selectedEndHour) {
                                    Toast.makeText(context, "Provide parameters matching standard hour intervals", Toast.LENGTH_SHORT).show()
                                    return@Button
                                }
                                isCreatingSlot = true

                                val calStart = Calendar.getInstance().apply {
                                    time = selectedDate
                                    set(Calendar.HOUR_OF_DAY, selectedStartHour)
                                    set(Calendar.MINUTE, 0)
                                    set(Calendar.SECOND, 0)
                                    set(Calendar.MILLISECOND, 0)
                                }

                                val calEnd = Calendar.getInstance().apply {
                                    time = selectedDate
                                    set(Calendar.HOUR_OF_DAY, selectedEndHour)
                                    set(Calendar.MINUTE, 0)
                                    set(Calendar.SECOND, 0)
                                    set(Calendar.MILLISECOND, 0)
                                }

                                val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                    timeZone = TimeZone.getTimeZone("UTC")
                                }

                                viewModel.createSlotForVenue(
                                    venueId = venue.id,
                                    startTimeIso = isoFormat.format(calStart.time),
                                    endTimeIso = isoFormat.format(calEnd.time),
                                    price = priceParsed,
                                    onSuccess = {
                                        viewModel.fetchSlotsForVenue(venue.id, { activeSlotsList = it }, {})
                                        isCreatingSlot = false
                                        Toast.makeText(context, "Slot injected successfully", Toast.LENGTH_SHORT).show()
                                    },
                                    onError = { msg ->
                                        isCreatingSlot = false
                                        Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
                                    }
                                )
                            },
                            enabled = !isCreatingSlot,
                            modifier = Modifier.fillMaxWidth().height(42.dp),
                            shape = RoundedCornerShape(6.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                        ) {
                            if (isCreatingSlot) {
                                CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp)
                            } else {
                                Text("Generate Active Slot", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }

                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f))
                        Text("Active Generated Inventory", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = brandDarkText)

                        if (isFetchingSlots) {
                            Box(modifier = Modifier.fillMaxWidth().height(80.dp), contentAlignment = Alignment.Center) {
                                CircularProgressIndicator(color = brandRed)
                            }
                        } else if (filteredSlots.isEmpty()) {
                            Text(
                                text = "No active open slots listed for this day.",
                                color = Color.Gray,
                                fontSize = 12.sp,
                                modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                                textAlign = TextAlign.Center
                            )
                        } else {
                            Box(modifier = Modifier.heightIn(max = 240.dp)) {
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(2),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(filteredSlots) { slot ->
                                        val displayTime = remember(slot.startTime, slot.endTime) {
                                            try {
                                                val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                                    timeZone = TimeZone.getTimeZone("UTC")
                                                }
                                                val outFormat = SimpleDateFormat("hh:mm a", Locale.US)
                                                val start = isoFormat.parse(slot.startTime)
                                                val end = isoFormat.parse(slot.endTime)
                                                "${outFormat.format(start!!)} - ${outFormat.format(end!!)}"
                                            } catch (e: Exception) {
                                                "Time Slot"
                                            }
                                        }

                                        Surface(
                                            color = Color(0xFFF8FAFC),
                                            shape = RoundedCornerShape(6.dp),
                                            border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.5f))
                                        ) {
                                            Column(
                                                modifier = Modifier.padding(10.dp),
                                                horizontalAlignment = Alignment.CenterHorizontally
                                            ) {
                                                Text(text = displayTime, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                                                Spacer(modifier = Modifier.height(2.dp))
                                                Text(text = "₹${slot.price}", fontSize = 11.sp, color = brandRed, fontWeight = FontWeight.Medium)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun AddVenueTab(
    viewModel: OwnerDashboardViewModel,
    brandRed: Color,
    brandDarkText: Color,
    categories: List<String>,
    onFormSuccessNavigation: () -> Unit
) {
    val context = LocalContext.current
    var name by remember { mutableStateOf("") }
    var showMapPicker by remember { mutableStateOf(false) }
    var chosenCoordinates by remember { mutableStateOf<LatLng?>(null) }
    var locationTextDisplay by remember { mutableStateOf("No location selected") }
    var addressInput by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var capacity by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Select Category") }
    var dropdownExpanded by remember { mutableStateOf(false) }
    var isSubmitting by remember { mutableStateOf(false) }

    val amenityOptions = remember {
        listOf("WiFi 📶", "Air Conditioning ❄️", "Sound System 🔊", "Parking 🚗", "Catering 🍽️", "Power Backup ⚡")
    }
    val selectedAmenities = remember { mutableStateListOf<String>() }
    val scrollState = rememberScrollState()

    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            if (viewModel.uploadedImageUrls.size >= 6) {
                Toast.makeText(context, "Exactly 6 photos are required.", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.uploadVenueImage(context, uri)
            }
        }
    }

    val mandRed = Color(0xFFE51E26)
    fun mandatoryLabel(text: String) = buildAnnotatedString {
        append(text)
        withStyle(style = SpanStyle(color = mandRed, fontWeight = FontWeight.Bold)) {
            append(" *")
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("Register New Venue", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A1A1A))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text(text = mandatoryLabel("Venue Name")) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            singleLine = true
        )

        OutlinedCard(
            onClick = { showMapPicker = true },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            colors = CardDefaults.outlinedCardColors(containerColor = Color.White),
            border = BorderStroke(width = 1.dp, color = Color.LightGray)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = mandatoryLabel("Venue Location Setup"),
                        fontSize = 12.sp,
                        color = Color.DarkGray
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = locationTextDisplay,
                        style = MaterialTheme.typography.bodyLarge,
                        fontSize = 14.sp,
                        color = if (chosenCoordinates != null) brandDarkText else Color.Gray
                    )
                }
                Text(
                    text = "Select Location",
                    color = brandRed,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        OutlinedTextField(
            value = addressInput,
            onValueChange = { addressInput = it },
            label = { Text(text = mandatoryLabel("Detailed Address (Building, Street, Landmark)")) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        )

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedTextField(
                value = price,
                onValueChange = { price = it },
                label = { Text(text = mandatoryLabel("Price / Hr")) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )
            OutlinedTextField(
                value = capacity,
                onValueChange = { capacity = it },
                label = { Text(text = mandatoryLabel("Max Capacity")) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )
        }

        ExposedDropdownMenuBox(
            expanded = dropdownExpanded,
            onExpandedChange = { dropdownExpanded = !dropdownExpanded },
            modifier = Modifier.fillMaxWidth()
        ) {
            OutlinedTextField(
                value = selectedCategory,
                onValueChange = {},
                readOnly = true,
                label = { Text(text = mandatoryLabel("Venue Category")) },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                modifier = Modifier.fillMaxWidth().menuAnchor(),
                shape = RoundedCornerShape(8.dp)
            )

            ExposedDropdownMenu(
                expanded = dropdownExpanded,
                onDismissRequest = { dropdownExpanded = false }
            ) {
                if (categories.isEmpty() || (categories.size == 1 && categories.first() == "All")) {
                    DropdownMenuItem(
                        text = { Text("No categories configured by admin", color = Color.Gray) },
                        onClick = {},
                        enabled = false
                    )
                } else {
                    categories.filter { it != "All" }.forEach { category ->
                        DropdownMenuItem(
                            text = { Text(text = category) },
                            onClick = {
                                selectedCategory = category
                                dropdownExpanded = false
                            }
                        )
                    }
                }
            }
        }

        OutlinedTextField(
            value = description,
            onValueChange = { description = it },
            label = { Text(text = mandatoryLabel("Venue Description Details")) },
            modifier = Modifier.fillMaxWidth().height(100.dp),
            shape = RoundedCornerShape(8.dp)
        )

        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = mandatoryLabel("Venue Amenities"), fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                amenityOptions.forEach { amenity ->
                    val isSelected = selectedAmenities.contains(amenity)
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            if (isSelected) selectedAmenities.remove(amenity) else selectedAmenities.add(amenity)
                        },
                        label = { Text(amenity, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = brandRed,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }
        }

        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = buildAnnotatedString {
                        append("Venue Photos ")
                        withStyle(style = SpanStyle(color = brandRed, fontWeight = FontWeight.Bold)) {
                            append("(Exactly 6 Required) *")
                        }
                    },
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = brandDarkText
                )
                Text(
                    text = "${viewModel.uploadedImageUrls.size} / 6",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (viewModel.uploadedImageUrls.size == 6) Color(0xFF10B981) else Color.Gray
                )
            }

            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp)
                    .background(Color.White, RoundedCornerShape(8.dp))
                    .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
                    .padding(10.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (viewModel.uploadedImageUrls.size < 6) {
                    item {
                        Box(
                            modifier = Modifier
                                .size(90.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFFF8FAFC))
                                .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
                                .clickable { galleryLauncher.launch("image/*") },
                            contentAlignment = Alignment.Center
                        ) {
                            if (viewModel.isUploadingImage) {
                                CircularProgressIndicator(color = brandRed, modifier = Modifier.size(24.dp), strokeWidth = 2.5.dp)
                            } else {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.Add, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(24.dp))
                                    Text("Add", fontSize = 11.sp, color = Color.Gray)
                                }
                            }
                        }
                    }
                }

                items(viewModel.uploadedImageUrls) { url ->
                    Box(modifier = Modifier.size(90.dp)) {
                        AsyncImage(
                            model = url,
                            contentDescription = null,
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(RoundedCornerShape(8.dp)),
                            contentScale = ContentScale.Crop
                        )
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(4.dp)
                                .size(20.dp)
                                .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                                .clickable { viewModel.removeUploadedImage(url) },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Close, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                        }
                    }
                }
            }

            viewModel.imageUploadError?.let { error ->
                Text(text = error, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(2.dp))
        Button(
            onClick = {
                val doublePrice = price.toDoubleOrNull()
                val intCapacity = capacity.toIntOrNull()

                if (name.isBlank() || chosenCoordinates == null || doublePrice == null || intCapacity == null ||
                    description.isBlank() || selectedCategory == "Select Category" || addressInput.isBlank()) {
                    Toast.makeText(context, "All fields are mandatory!", Toast.LENGTH_SHORT).show()
                    return@Button
                }

                if (viewModel.uploadedImageUrls.size != 6) {
                    Toast.makeText(context, "You must upload exactly 6 photos to submit!", Toast.LENGTH_LONG).show()
                    return@Button
                }

                isSubmitting = true
                viewModel.submitVenue(
                    name = name,
                    location = locationTextDisplay,
                    address = addressInput,
                    price = doublePrice,
                    capacity = intCapacity,
                    description = description,
                    category = selectedCategory,
                    amenities = selectedAmenities.toList(),
                    onSuccess = {
                        isSubmitting = false
                        onFormSuccessNavigation()
                    },
                    onError = { message ->
                        isSubmitting = false
                        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
                    }
                )
            },
            enabled = !isSubmitting && !viewModel.isUploadingImage,
            modifier = Modifier.fillMaxWidth().height(46.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = brandRed)
        ) {
            if (isSubmitting) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White, strokeWidth = 2.5.dp)
            } else {
                Text("Submit Property For Verification", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }
        }
    }

    if (showMapPicker) {
        MapLocationPickerScale(
            onLocationConfirmed = { coordinates ->
                chosenCoordinates = coordinates
                val geocoder = Geocoder(context, Locale.getDefault())
                try {
                    val addresses = geocoder.getFromLocation(coordinates.latitude, coordinates.longitude, 1)
                    if (!addresses.isNullOrEmpty()) {
                        val fetchedAddress = addresses[0].getAddressLine(0)
                        if (!fetchedAddress.isNullOrBlank()) {
                            locationTextDisplay = fetchedAddress
                        } else {
                            locationTextDisplay = "${coordinates.latitude}, ${coordinates.longitude}"
                        }
                    } else {
                        locationTextDisplay = "${coordinates.latitude}, ${coordinates.longitude}"
                    }
                } catch (e: Exception) {
                    locationTextDisplay = "${coordinates.latitude}, ${coordinates.longitude}"
                }
                showMapPicker = false
            },
            onDismiss = { showMapPicker = false }
        )
    }
}

@Composable
fun OwnerProfileTab(
    userName: String,
    userEmail: String,
    onLogoutClick: () -> Unit,
    brandRed: Color,
    brandDarkText: Color,
    venues: List<OwnerVenueItem> = emptyList(),
    viewModel: OwnerDashboardViewModel
) {
    val overview = viewModel.ownerOverviewState
    val totalEarnings = overview?.totalEarnings ?: 0.0

    ExpandedProfileLayout(
        isLoggedIn = true,
        userName = userName,
        userEmail = userEmail,
        role = "OWNER",
        onLogoutClick = onLogoutClick,
        onNavigateToLogin = {},
        statCountOne = venues.count { it.status == "ACTIVE" },
        statAmountTwo = totalEarnings,
        ownerVenuesList = venues
    )
}