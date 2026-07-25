package com.example.bookmyvenue.ui_layout

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.bookmyvenue.data.BookingUiState
import com.example.bookmyvenue.data.BookingViewModel
import com.example.bookmyvenue.data.RazorpayOrderDto
import com.example.bookmyvenue.data.VenueSlotDto
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun VenueDetailScreen(
    venueId: String,
    venueName: String,
    categoryName: String,
    pricePerHour: Double,
    location: String,
    description: String,
    imageUrls: List<String>,
    amenities: List<String>,
    bookingViewModel: BookingViewModel,
    onBackClick: () -> Unit,
    onNavigateToCheckout: (RazorpayOrderDto) -> Unit,
    modifier: Modifier = Modifier
) {
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)
    val context = LocalContext.current

    val scrollState = rememberScrollState()
    val images = if (imageUrls.isEmpty()) listOf("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800") else imageUrls
    val pagerState = rememberPagerState(pageCount = { images.size })

    val bookingUiState by bookingViewModel.uiState.collectAsState()
    var selectedDate by remember { mutableStateOf(Calendar.getInstance().time) }
    var selectedSlot by remember { mutableStateOf<VenueSlotDto?>(null) }

    LaunchedEffect(venueId) {
        bookingViewModel.fetchSlots(venueId)
    }

    LaunchedEffect(bookingUiState) {
        if (bookingUiState is BookingUiState.OrderCreated) {
            onNavigateToCheckout((bookingUiState as BookingUiState.OrderCreated).orderDetails)
        } else if (bookingUiState is BookingUiState.Error) {
            Toast.makeText(context, (bookingUiState as BookingUiState.Error).message, Toast.LENGTH_LONG).show()
        }
    }

    val datesList = remember {
        val list = mutableListOf<Date>()
        val cal = Calendar.getInstance()
        repeat(14) {
            list.add(cal.time)
            cal.add(Calendar.DAY_OF_YEAR, 1)
        }
        list
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Venue Details", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White, titleContentColor = brandDarkText)
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                modifier = Modifier.border(width = 0.5.dp, color = Color.LightGray.copy(alpha = 0.4f))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Selected Slot Price", fontSize = 12.sp, color = Color.Gray)
                        Text(
                            text = if (selectedSlot != null) "₹${selectedSlot!!.price}" else "₹$pricePerHour / hr",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = brandRed
                        )
                    }
                    Button(
                        onClick = {
                            selectedSlot?.let {
                                bookingViewModel.initiateCheckout(it.id)
                            } ?: Toast.makeText(context, "Please select a time slot first", Toast.LENGTH_SHORT).show()
                        },
                        enabled = selectedSlot != null && bookingUiState !is BookingUiState.Loading,
                        colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.height(46.dp).padding(horizontal = 8.dp)
                    ) {
                        if (bookingUiState is BookingUiState.Loading) {
                            CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp)
                        } else {
                            Text("Book Selected Slot", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                    }
                }
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(lightCanvasBg)
                .verticalScroll(scrollState)
        ) {
            Box(modifier = Modifier.fillMaxWidth().height(240.dp)) {
                HorizontalPager(state = pagerState, modifier = Modifier.fillMaxSize()) { page ->
                    AsyncImage(
                        model = images[page],
                        contentDescription = null,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
                Row(
                    Modifier
                        .wrapContentHeight()
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 12.dp),
                    horizontalArrangement = Arrangement.Center
                ) {
                    repeat(images.size) { iteration ->
                        val color = if (pagerState.currentPage == iteration) brandRed else Color.White.copy(alpha = 0.6f)
                        Box(
                            modifier = Modifier
                                .padding(3.dp)
                                .clip(CircleShape)
                                .background(color)
                                .size(7.dp)
                        )
                    }
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Surface(color = brandRed.copy(alpha = 0.08f), shape = RoundedCornerShape(4.dp)) {
                            Text(
                                text = categoryName.uppercase(),
                                color = brandRed,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                        Text(text = venueName, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Text(text = "$location", fontSize = 14.sp, color = Color.Gray)
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                        Text("Select Date", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Spacer(modifier = Modifier.height(12.dp))

                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(datesList) { date ->
                                val isDaySelected = SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(date) ==
                                        SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(selectedDate)

                                Column(
                                    modifier = Modifier
                                        .width(60.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (isDaySelected) brandRed else Color(0xFFF1F5F9))
                                        .clickable {
                                            selectedDate = date
                                            selectedSlot = null
                                        }
                                        .padding(vertical = 10.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(
                                        text = SimpleDateFormat("EEE", Locale.getDefault()).format(date).uppercase(),
                                        fontSize = 11.sp,
                                        color = if (isDaySelected) Color.White else Color.Gray,
                                        fontWeight = FontWeight.Medium
                                    )
                                    Text(
                                        text = SimpleDateFormat("dd", Locale.getDefault()).format(date),
                                        fontSize = 16.sp,
                                        color = if (isDaySelected) Color.White else brandDarkText,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                        Text("Available Slots", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Spacer(modifier = Modifier.height(12.dp))

                        when (bookingUiState) {
                            is BookingUiState.Loading -> {
                                Box(modifier = Modifier.fillMaxWidth().height(100.dp), contentAlignment = Alignment.Center) {
                                    CircularProgressIndicator(color = brandRed)
                                }
                            }
                            is BookingUiState.Error -> {
                                Text(
                                    text = "Error gathering venue hours.",
                                    color = brandRed,
                                    fontSize = 13.sp,
                                    modifier = Modifier.fillMaxWidth(),
                                    textAlign = TextAlign.Center
                                )
                            }
                            else -> {
                                val allSlots = when (val state = bookingUiState) {
                                    is BookingUiState.SlotsLoaded -> state.slots
                                    else -> emptyList()
                                }

                                val filteredSlots = allSlots.filter { slot ->
                                    try {
                                        val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).apply {
                                            timeZone = TimeZone.getTimeZone("UTC")
                                        }
                                        val slotDate = isoFormat.parse(slot.startTime)
                                        if (slotDate != null) {
                                            val fmt = SimpleDateFormat("yyyyMMdd", Locale.getDefault())
                                            fmt.format(slotDate) == fmt.format(selectedDate)
                                        } else {
                                            false
                                        }
                                    } catch (e: Exception) {
                                        false
                                    }
                                }

                                if (filteredSlots.isEmpty()) {
                                    Text(
                                        text = "No active open slots listed for this day.",
                                        color = Color.Gray,
                                        fontSize = 13.sp,
                                        modifier = Modifier.fillMaxWidth().padding(vertical = 20.dp),
                                        textAlign = TextAlign.Center
                                    )
                                } else {
                                    Box(modifier = Modifier.heightIn(max = 280.dp)) {
                                        LazyVerticalGrid(
                                            columns = GridCells.Fixed(2),
                                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                                            verticalArrangement = Arrangement.spacedBy(10.dp)
                                        ) {
                                            items(filteredSlots) { slot ->
                                                val currentClock = remember { Date() }

                                                val slotStart = remember(slot.startTime) {
                                                    try {
                                                        SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).apply {
                                                            timeZone = TimeZone.getTimeZone("UTC")
                                                        }.parse(slot.startTime)
                                                    } catch (e: Exception) {
                                                        null
                                                    }
                                                }

                                                val slotEnd = remember(slot.endTime) {
                                                    try {
                                                        SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).apply {
                                                            timeZone = TimeZone.getTimeZone("UTC")
                                                        }.parse(slot.endTime)
                                                    } catch (e: Exception) {
                                                        null
                                                    }
                                                }

                                                val isReserved = slot.bookings?.any { it.status == "CONFIRMED" || it.status == "PENDING_PAYMENT" } ?: false
                                                val isPastStart = slotStart != null && slotStart.before(currentClock)
                                                val isDisabled = isReserved || isPastStart

                                                val isSlotSelected = selectedSlot?.id == slot.id && !isDisabled

                                                val displayTime = remember(slotStart, slotEnd) {
                                                    if (slotStart != null && slotEnd != null) {
                                                        val outFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
                                                        "${outFormat.format(slotStart)} - ${outFormat.format(slotEnd)}"
                                                    } else {
                                                        "Time Slot"
                                                    }
                                                }

                                                Surface(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .clickable(enabled = !isDisabled) { selectedSlot = slot },
                                                    color = when {
                                                        isDisabled -> Color(0xFFE2E8F0)
                                                        isSlotSelected -> brandRed.copy(alpha = 0.08f)
                                                        else -> Color.White
                                                    },
                                                    shape = RoundedCornerShape(8.dp),
                                                    border = BorderStroke(
                                                        width = if (isSlotSelected) 1.5.dp else 1.dp,
                                                        color = when {
                                                            isDisabled -> Color(0xFFCBD5E1)
                                                            isSlotSelected -> brandRed
                                                            else -> Color.LightGray.copy(alpha = 0.5f)
                                                        }
                                                    )
                                                ) {
                                                    Column(
                                                        modifier = Modifier.padding(12.dp),
                                                        horizontalAlignment = Alignment.CenterHorizontally
                                                    ) {
                                                        Text(
                                                            text = displayTime,
                                                            fontSize = 12.sp,
                                                            fontWeight = FontWeight.Bold,
                                                            color = if (isDisabled) Color.Gray else brandDarkText
                                                        )
                                                        Spacer(modifier = Modifier.height(4.dp))
                                                        Text(
                                                            text = when {
                                                                isReserved -> "Reserved"
                                                                isPastStart -> "Expired"
                                                                else -> "₹${slot.price}"
                                                            },
                                                            fontSize = 12.sp,
                                                            color = if (isDisabled) Color.Gray else brandRed,
                                                            fontWeight = FontWeight.Medium
                                                        )
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

                if (amenities.isNotEmpty()) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Text("Offered Amenities", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                                items(amenities) { amenity ->
                                    Surface(
                                        color = Color(0xFFF1F5F9),
                                        shape = RoundedCornerShape(6.dp),
                                        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.5f))
                                    ) {
                                        Text(
                                            text = amenity,
                                            fontSize = 12.sp,
                                            color = Color.DarkGray,
                                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("About the Venue", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Text(
                            text = description.ifBlank { "No additional details provided by the venue host." },
                            fontSize = 14.sp,
                            color = Color.DarkGray,
                            lineHeight = 20.sp,
                            textAlign = TextAlign.Justify
                        )
                    }
                }
            }
        }
    }
}