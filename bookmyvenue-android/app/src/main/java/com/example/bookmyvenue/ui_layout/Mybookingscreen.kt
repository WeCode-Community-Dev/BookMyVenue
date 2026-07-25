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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.bookmyvenue.data.BookingViewModel
import com.example.bookmyvenue.data.UserBookingsUiState
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyBookingsScreen(
    bookingViewModel: BookingViewModel,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val bookingsState = bookingViewModel.userBookingsState.collectAsStateWithLifecycle().value

    LaunchedEffect(Unit) {
        bookingViewModel.fetchUserBookings()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Bookings", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
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
                .background(Color(0xFFF6F8FA))
        ) {
            when (bookingsState) {
                is UserBookingsUiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = brandRed)
                    }
                }
                is UserBookingsUiState.Success -> {
                    if (bookingsState.bookings.isEmpty()) {
                        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text("No reservations booked yet.", color = Color.Gray, fontSize = 14.sp)
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(14.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            items(bookingsState.bookings) { item ->
                                val formattedDate = remember(item.bookedStartTime) {
                                    try {
                                        val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                            timeZone = TimeZone.getTimeZone("UTC")
                                        }
                                        val date = isoFormat.parse(item.bookedStartTime)
                                        SimpleDateFormat("EEE, dd MMM yyyy", Locale.getDefault()).format(date!!)
                                    } catch (e: Exception) {
                                        "N/A"
                                    }
                                }

                                val formattedSlotTiming = remember(item.bookedStartTime, item.bookedEndTime) {
                                    try {
                                        val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                            timeZone = TimeZone.getTimeZone("UTC")
                                        }
                                        val start = isoFormat.parse(item.bookedStartTime)
                                        val end = isoFormat.parse(item.bookedEndTime)
                                        val timeFmt = SimpleDateFormat("hh:mm a", Locale.getDefault())
                                        "${timeFmt.format(start!!)} - ${timeFmt.format(end!!)}"
                                    } catch (e: Exception) {
                                        "N/A"
                                    }
                                }

                                val isHoldExpired = remember(item.expiresAt) {
                                    try {
                                        if (item.expiresAt == null) false
                                        else {
                                            val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                                timeZone = TimeZone.getTimeZone("UTC")
                                            }
                                            val expiry = isoFormat.parse(item.expiresAt)
                                            expiry != null && expiry.before(Date())
                                        }
                                    } catch (e: Exception) {
                                        false
                                    }
                                }

                                val statusText = remember(item.status, isHoldExpired) {
                                    when {
                                        item.status.equals("CANCELLED", ignoreCase = true) -> "CANCELLED"
                                        item.status.equals("EXPIRED", ignoreCase = true) || (item.status.equals("PENDING_PAYMENT", ignoreCase = true) && isHoldExpired) -> "EXPIRED"
                                        item.status.equals("PENDING_PAYMENT", ignoreCase = true) -> "PENDING PAYMENT"
                                        else -> "CONFIRMED"
                                    }
                                }

                                val statusBg = when (statusText) {
                                    "CANCELLED" -> Color(0xFFFCE8E6)
                                    "EXPIRED" -> Color(0xFFF1F5F9)
                                    "PENDING PAYMENT" -> Color(0xFFFEF3C7)
                                    else -> Color(0xFFE6F4EA)
                                }

                                val statusFg = when (statusText) {
                                    "CANCELLED" -> Color(0xFFC5221F)
                                    "EXPIRED" -> Color(0xFF64748B)
                                    "PENDING PAYMENT" -> Color(0xFFB45309)
                                    else -> Color(0xFF137333)
                                }

                                Card(
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = Color.White),
                                    border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(
                                        modifier = Modifier.padding(14.dp),
                                        verticalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = formattedDate,
                                                fontSize = 12.sp,
                                                color = Color.Gray,
                                                fontWeight = FontWeight.Medium
                                            )

                                            Surface(
                                                shape = RoundedCornerShape(4.dp),
                                                color = statusBg
                                            ) {
                                                Text(
                                                    text = statusText,
                                                    fontSize = 10.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = statusFg,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                        }

                                        Text(
                                            text = item.venue.name,
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = brandDarkText,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )

                                        Text(
                                            text = "${item.venue.location}",
                                            fontSize = 12.sp,
                                            color = Color.Gray,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )

                                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.25f))

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Column {
                                                Text("Timing Slot", fontSize = 11.sp, color = Color.Gray)
                                                Text(formattedSlotTiming, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                                            }
                                            Column(horizontalAlignment = Alignment.End) {
                                                Text("Amount", fontSize = 11.sp, color = Color.Gray)
                                                Text("₹${item.totalPrice}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandRed)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                is UserBookingsUiState.Error -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(bookingsState.message, color = Color.Gray, fontSize = 13.sp)
                    }
                }
            }
        }
    }
}