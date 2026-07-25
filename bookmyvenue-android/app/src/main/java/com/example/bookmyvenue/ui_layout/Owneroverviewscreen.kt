package com.example.bookmyvenue.ui_layout
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bookmyvenue.data.BookingViewModel
import com.example.bookmyvenue.data.HistoryBookingItemDto
import com.example.bookmyvenue.data.OwnerOverviewUiState
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OwnerOverviewScreen(
    bookingViewModel: BookingViewModel,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)

    val overviewUiState by bookingViewModel.ownerOverviewState.collectAsState()

    LaunchedEffect(Unit) {
        bookingViewModel.fetchOwnerOverview()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Business Dashboard", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = brandDarkText
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(lightCanvasBg)
        ) {
            when (val state = overviewUiState) {
                is OwnerOverviewUiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = brandRed)
                    }
                }
                is OwnerOverviewUiState.Error -> {
                    Box(modifier = Modifier.fillMaxSize().padding(16.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = state.message,
                            color = brandRed,
                            textAlign = TextAlign.Center,
                            fontSize = 14.sp
                        )
                    }
                }
                is OwnerOverviewUiState.Success -> {
                    val data = state.overview
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                MetricCard(
                                    title = "Total Earnings",
                                    value = "₹${data.totalEarnings}",
                                    valueColor = Color(0xFF137333),
                                    modifier = Modifier.weight(1f)
                                )
                                MetricCard(
                                    title = "Total Bookings",
                                    value = "${data.totalBookingsCount}",
                                    valueColor = brandDarkText,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }

                        item {
                            Text(
                                text = "Upcoming Reservations",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = brandDarkText,
                                modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                            )
                        }

                        if (data.upcomingBookings.isEmpty()) {
                            item {
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = Color.White),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Box(
                                        modifier = Modifier.fillMaxWidth().padding(32.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "No upcoming reservations scheduled.",
                                            color = Color.Gray,
                                            fontSize = 13.sp
                                        )
                                    }
                                }
                            }
                        } else {
                            items(data.upcomingBookings) { booking ->
                                OwnerUpcomingBookingCard(
                                    booking = booking,
                                    brandRed = brandRed,
                                    brandDarkText = brandDarkText
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    valueColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = title, fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = valueColor)
        }
    }
}

@Composable
fun OwnerUpcomingBookingCard(
    booking: HistoryBookingItemDto,
    brandRed: Color,
    brandDarkText: Color
) {
    val formattedDate = remember(booking.bookedStartTime) {
        try {
            val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).apply {
                timeZone = TimeZone.getTimeZone("UTC")
            }
            val date = isoFormat.parse(booking.bookedStartTime)
            val outputFormat = SimpleDateFormat("EEE, dd MMM yyyy", Locale.getDefault())
            date?.let { outputFormat.format(it) } ?: "Unknown Date"
        } catch (e: Exception) {
            "Unknown Date"
        }
    }

    val formattedTime = remember(booking.bookedStartTime, booking.bookedEndTime) {
        try {
            val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).apply {
                timeZone = TimeZone.getTimeZone("UTC")
            }
            val start = isoFormat.parse(booking.bookedStartTime)
            val end = isoFormat.parse(booking.bookedEndTime)
            val outFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
            if (start != null && end != null) {
                "${outFormat.format(start)} - ${outFormat.format(end)}"
            } else {
                "Time Block Unavailable"
            }
        } catch (e: Exception) {
            "Time Block Unavailable"
        }
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = booking.venue.name.uppercase(),
                    fontSize = 11.sp,
                    color = brandRed,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = formattedDate,
                    fontSize = 12.sp,
                    color = Color.Gray,
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = booking.user?.name ?: "Customer",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = brandDarkText
            )
            Text(
                text = booking.user?.email ?: "No contact information",
                fontSize = 13.sp,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.height(12.dp))
            Divider(color = Color.LightGray.copy(alpha = 0.3f), thickness = 1.dp)
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(text = "Reserved Timing", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        text = formattedTime,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = brandDarkText
                    )
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text(text = "Earnings", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        text = "₹${booking.totalPrice}",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF137333)
                    )
                }
            }
        }
    }
}