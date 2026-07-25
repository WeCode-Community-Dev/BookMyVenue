package com.example.bookmyvenue.ui_layout
import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun AdminVenueDetailScreen(
    venue: AdminVenueItem,
    onApprove: (String) -> Unit,
    onReject: (String, String) -> Unit,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)

    val context = LocalContext.current
    val scrollState = rememberScrollState()
    var showRejectDialog by remember { mutableStateOf(false) }
    var rejectionReason by remember { mutableStateOf("") }

    val pagerState = rememberPagerState(pageCount = { if (venue.imageUrls.isEmpty()) 1 else venue.imageUrls.size })

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Verify Property", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
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
        bottomBar = {
            if (venue.status == "PENDING") {
                Surface(
                    color = Color.White,
                    tonalElevation = 8.dp,
                    modifier = Modifier.border(0.5.dp, Color.LightGray.copy(alpha = 0.4f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedButton(
                            onClick = { showRejectDialog = true },
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = brandRed),
                            border = BorderStroke(1.dp, brandRed),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp)
                        ) {
                            Text("Reject Application", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }

                        Button(
                            onClick = {
                                onApprove(venue.id)
                                Toast.makeText(context, "Property approved successfully", Toast.LENGTH_SHORT).show()
                                onBackClick()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp)
                        ) {
                            Text("Approve Property", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
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
            Box(modifier = Modifier.fillMaxWidth().height(220.dp)) {
                if (venue.imageUrls.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color(0xFFE2E8F0)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("No venue images uploaded", color = Color.Gray, fontSize = 14.sp)
                    }
                } else {
                    HorizontalPager(state = pagerState, modifier = Modifier.fillMaxSize()) { page ->
                        AsyncImage(
                            model = venue.imageUrls[page],
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
                        repeat(venue.imageUrls.size) { iteration ->
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
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = venue.name, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = brandDarkText, modifier = Modifier.weight(1f))
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = when (venue.status) {
                                    "ACTIVE" -> Color(0xFFE6F4EA)
                                    "PENDING" -> Color(0xFFFEF3C7)
                                    else -> Color(0xFFFCE8E6)
                                }
                            ) {
                                Text(
                                    text = venue.status, fontSize = 11.sp, fontWeight = FontWeight.Bold,
                                    color = when (venue.status) {
                                        "ACTIVE" -> Color(0xFF137333)
                                        "PENDING" -> Color(0xFFB45309)
                                        else -> Color(0xFFC5221F)
                                    },
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(text = "${venue.location}", fontSize = 14.sp, color = Color.Gray)
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "₹${venue.pricePerHour} / hour",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = brandRed
                        )
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Property Specifications", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Category", color = Color.Gray, fontSize = 13.sp)
                            Text(venue.category, fontWeight = FontWeight.SemiBold, color = brandDarkText, fontSize = 13.sp)
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Max Capacity", color = Color.Gray, fontSize = 13.sp)
                            Text("${venue.capacity} People", fontWeight = FontWeight.SemiBold, color = brandDarkText, fontSize = 13.sp)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Text("Submitted By", color = Color.Gray, fontSize = 13.sp)
                            Text(venue.ownerName, fontWeight = FontWeight.SemiBold, color = brandDarkText, fontSize = 13.sp)
                        }
                        if (venue.ownerEmail.isNotBlank()) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.Top
                            ) {
                                Text("Email", color = Color.Gray, fontSize = 13.sp)
                                Text(venue.ownerEmail, fontWeight = FontWeight.Medium, color = brandDarkText, fontSize = 13.sp)
                            }
                        }
                    }
                }

                if (venue.amenities.isNotEmpty()) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Text("Offered Amenities", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                            HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f))

                            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                items(venue.amenities) { amenity ->
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
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Description Details", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f))
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = venue.description.ifBlank { "No additional description details provided." },
                            fontSize = 13.sp,
                            color = Color.DarkGray,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }
    }

    if (showRejectDialog) {
        AlertDialog(
            onDismissRequest = { showRejectDialog = false },
            title = { Text("Specify Rejection Reason", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
            text = {
                OutlinedTextField(
                    value = rejectionReason,
                    onValueChange = { rejectionReason = it },
                    placeholder = { Text("Explain why this venue is rejected...") },
                    modifier = Modifier.fillMaxWidth().height(90.dp),
                    shape = RoundedCornerShape(8.dp)
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (rejectionReason.isBlank()) {
                            Toast.makeText(context, "Reason is mandatory", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        onReject(venue.id, rejectionReason)
                        showRejectDialog = false
                        Toast.makeText(context, "Application rejected", Toast.LENGTH_SHORT).show()
                        onBackClick()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                ) {
                    Text("Confirm Rejection", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showRejectDialog = false }) {
                    Text("Cancel", color = Color.Gray)
                }
            },
            containerColor = Color.White
        )
    }
}