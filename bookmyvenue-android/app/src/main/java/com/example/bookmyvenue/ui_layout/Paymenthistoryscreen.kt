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
import java.util.Locale
import java.util.TimeZone

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaymentHistoryScreen(
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
                title = { Text("Payment History", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
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
                            Text("No payment receipts available.", color = Color.Gray, fontSize = 14.sp)
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(14.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            items(bookingsState.bookings) { item ->
                                val formattedPaidDate = remember(item.createdAt) {
                                    try {
                                        val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                                            timeZone = TimeZone.getTimeZone("UTC")
                                        }
                                        val date = isoFormat.parse(item.createdAt)
                                        SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(date!!)
                                    } catch (e: Exception) {
                                        item.createdAt
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

                                val paymentStatus = when {
                                    item.status.equals("CANCELLED", ignoreCase = true) -> "REFUNDED"
                                    item.status.equals("CONFIRMED", ignoreCase = true) || item.status.equals("PAID", ignoreCase = true) -> "SUCCESS"
                                    else -> "FAILURE"
                                }

                                val statusBg = when (paymentStatus) {
                                    "SUCCESS" -> Color(0xFFE6F4EA)
                                    "REFUNDED" -> Color(0xFFFEF3C7)
                                    else -> Color(0xFFFCE8E6)
                                }

                                val statusFg = when (paymentStatus) {
                                    "SUCCESS" -> Color(0xFF137333)
                                    "REFUNDED" -> Color(0xFFB45309)
                                    else -> Color(0xFFC5221F)
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
                                                text = item.venue.name,
                                                fontSize = 15.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = brandDarkText,
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis,
                                                modifier = Modifier.weight(1f, fill = false)
                                            )
                                            Spacer(modifier = Modifier.width(8.dp))

                                            Surface(
                                                shape = RoundedCornerShape(4.dp),
                                                color = statusBg
                                            ) {
                                                Text(
                                                    text = paymentStatus,
                                                    fontSize = 10.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = statusFg,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                        }

                                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.25f))

                                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                            Text("Transaction ID", fontSize = 12.sp, color = Color.Gray)
                                            Text(
                                                text = item.payment?.paymentId ?: "N/A",
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = brandDarkText
                                            )
                                        }

                                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                            Text("Booking ID", fontSize = 12.sp, color = Color.Gray)
                                            Text(
                                                text = item.id.take(12).uppercase(),
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = brandDarkText
                                            )
                                        }

                                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                            Text("Payment Mode", fontSize = 12.sp, color = Color.Gray)
                                            Text(
                                                text = item.payment?.method ?: "Online Payment",
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Medium,
                                                color = brandDarkText
                                            )
                                        }

                                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                            Text("Reserved Slot", fontSize = 12.sp, color = Color.Gray)
                                            Text(formattedSlotTiming, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = brandDarkText)
                                        }

                                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                            Text("Date & Time", fontSize = 12.sp, color = Color.Gray)
                                            Text(formattedPaidDate, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = brandDarkText)
                                        }

                                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.2f))

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text("Amount Paid", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                                            Text("₹${item.totalPrice}", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = brandRed)
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