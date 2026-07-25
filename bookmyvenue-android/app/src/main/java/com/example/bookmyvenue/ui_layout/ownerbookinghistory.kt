package com.example.bookmyvenue.ui_layout

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bookmyvenue.data.HistoryBookingItemDto
import com.example.bookmyvenue.data.OwnerDashboardViewModel
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

@Composable
fun OwnerBookingsAndPaymentsScreen(
    viewModel: OwnerDashboardViewModel,
    modifier: Modifier = Modifier
) {
    var selectedTabIndex by remember { mutableIntStateOf(0) }
    val tabs = listOf("Upcoming", "Completed", "Payment History")
    val brandRed = Color(0xFFE51E26)
    val brandGreen = Color(0xFF10B981)
    val brandDarkText = Color(0xFF1A1A1A)

    LaunchedEffect(selectedTabIndex) {
        viewModel.fetchOwnerOverview()
    }

    val overviewData = viewModel.ownerOverviewState
    val isLoading = viewModel.isOverviewLoading

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFF6F8FA))
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Total Revenue", fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "₹${overviewData?.totalEarnings ?: 0.0}",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = brandGreen
                    )
                }
                Surface(
                    color = brandRed.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(0.5.dp, brandRed.copy(alpha = 0.3f))
                ) {
                    Text(
                        text = "${overviewData?.totalBookingsCount ?: 0} Bookings",
                        color = brandRed,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        TabRow(
            selectedTabIndex = selectedTabIndex,
            containerColor = Color.White,
            contentColor = brandRed,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    Modifier.tabIndicatorOffset(tabPositions[selectedTabIndex]),
                    color = brandRed
                )
            }
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTabIndex == index,
                    onClick = { selectedTabIndex = index },
                    text = { Text(title, fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                    selectedContentColor = brandRed,
                    unselectedContentColor = Color.Gray
                )
            }
        }

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = brandRed)
            }
        } else {
            when (selectedTabIndex) {
                0 -> BookingListSection(
                    bookings = overviewData?.upcomingBookings ?: emptyList(),
                    emptyMessage = "No active upcoming reservations found.",
                    brandGreen = brandGreen,
                    brandDarkText = brandDarkText
                )
                1 -> BookingListSection(
                    bookings = overviewData?.completedBookings ?: emptyList(),
                    emptyMessage = "No past completed reservations found.",
                    brandGreen = brandGreen,
                    brandDarkText = brandDarkText
                )
                2 -> PaymentLedgerSection(
                    bookings = overviewData?.allBookings ?: emptyList(),
                    brandGreen = brandGreen,
                    brandDarkText = brandDarkText
                )
            }
        }
    }
}

@Composable
fun BookingListSection(
    bookings: List<HistoryBookingItemDto>,
    emptyMessage: String,
    brandGreen: Color,
    brandDarkText: Color
) {
    if (bookings.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(text = emptyMessage, color = Color.Gray, fontSize = 13.sp)
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(bookings) { booking ->
                OwnerBookingCard(booking = booking, brandGreen = brandGreen, brandDarkText = brandDarkText)
            }
        }
    }
}

@Composable
fun OwnerBookingCard(
    booking: HistoryBookingItemDto,
    brandGreen: Color,
    brandDarkText: Color
) {
    val formattedTiming = remember(booking.bookedStartTime, booking.bookedEndTime) {
        formatBookingTimeRange(booking.bookedStartTime, booking.bookedEndTime)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = booking.venue.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = brandDarkText
                )
                Text(
                    text = "₹${booking.totalPrice}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = brandGreen
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(15.dp), tint = Color.Gray)
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = booking.user?.name ?: "Customer", fontSize = 12.sp, color = brandDarkText)
                booking.user?.email?.let { email ->
                    Text(text = " ($email)", fontSize = 11.sp, color = Color.Gray)
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.DateRange, contentDescription = null, modifier = Modifier.size(15.dp), tint = Color.Gray)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = formattedTiming,
                    fontSize = 12.sp,
                    color = Color.DarkGray
                )
            }
        }
    }
}

@Composable
fun PaymentLedgerSection(
    bookings: List<HistoryBookingItemDto>,
    brandGreen: Color,
    brandDarkText: Color
) {
    if (bookings.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(text = "No financial records found.", color = Color.Gray, fontSize = 13.sp)
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(bookings) { booking ->
                ExpandablePaymentLedgerCard(booking = booking, brandGreen = brandGreen, brandDarkText = brandDarkText)
            }
        }
    }
}

@Composable
fun ExpandablePaymentLedgerCard(
    booking: HistoryBookingItemDto,
    brandGreen: Color,
    brandDarkText: Color
) {
    var expanded by remember { mutableStateOf(false) }
    val payment = booking.payment
    val isPaid = booking.status == "CONFIRMED"
    val transactionDate = remember(booking.createdAt) {
        formatIsoToReadableDateTime(booking.createdAt)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .animateContentSize()
            .clickable { expanded = !expanded },
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = booking.venue.name,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = brandDarkText
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = booking.user?.name ?: "Customer",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = if (isPaid) brandGreen.copy(alpha = 0.12f) else Color(0xFFEF4444).copy(alpha = 0.12f),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Text(
                            text = if (isPaid) "PAID" else booking.status,
                            color = if (isPaid) brandGreen else Color(0xFFEF4444),
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Text(
                        text = "₹${booking.totalPrice}",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = brandGreen
                    )

                    Spacer(modifier = Modifier.width(4.dp))

                    Icon(
                        imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = if (expanded) "Collapse" else "Expand",
                        tint = Color.Gray,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            AnimatedVisibility(visible = expanded) {
                Column {
                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 10.dp),
                        color = Color.LightGray.copy(alpha = 0.3f)
                    )

                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Booking ID:", fontSize = 11.sp, color = Color.Gray)
                            Text(
                                text = booking.id.take(12).uppercase(),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = brandDarkText
                            )
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Transaction ID:", fontSize = 11.sp, color = Color.Gray)
                            Text(
                                text = payment?.paymentId ?: "N/A",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = brandDarkText
                            )
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Paid On:", fontSize = 11.sp, color = Color.Gray)
                            Text(
                                text = transactionDate,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = brandDarkText
                            )
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Customer Email:", fontSize = 11.sp, color = Color.Gray)
                            Text(
                                text = booking.user?.email ?: "N/A",
                                fontSize = 11.sp,
                                color = brandDarkText
                            )
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Method:", fontSize = 11.sp, color = Color.Gray)
                            Text(
                                text = payment?.method ?: "CARD/ONLINE",
                                fontSize = 11.sp,
                                color = brandDarkText
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun formatBookingTimeRange(startTimeIso: String, endTimeIso: String): String {
    return try {
        val parser = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US).apply {
            timeZone = TimeZone.getTimeZone("UTC")
        }
        val cleanStart = startTimeIso.take(19)
        val cleanEnd = endTimeIso.take(19)

        val startDate = parser.parse(cleanStart)
        val endDate = parser.parse(cleanEnd)

        val dateFmt = SimpleDateFormat("EEE, dd MMM yyyy", Locale.getDefault())
        val timeFmt = SimpleDateFormat("hh:mm a", Locale.getDefault())

        if (startDate != null && endDate != null) {
            "${dateFmt.format(startDate)} | ${timeFmt.format(startDate)} - ${timeFmt.format(endDate)}"
        } else {
            "$startTimeIso - $endTimeIso"
        }
    } catch (_: Exception) {
        "$startTimeIso - $endTimeIso"
    }
}

private fun formatIsoToReadableDateTime(isoTimestamp: String): String {
    return try {
        val parser = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US).apply {
            timeZone = TimeZone.getTimeZone("UTC")
        }
        val cleanIso = isoTimestamp.take(19)
        val date = parser.parse(cleanIso)
        val formatter = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault())
        if (date != null) formatter.format(date) else isoTimestamp
    } catch (_: Exception) {
        isoTimestamp
    }
}