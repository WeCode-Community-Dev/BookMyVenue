package com.example.bookmyvenue.ui_layout

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun VenueDetailScreen(
    venueName: String,
    categoryName: String,
    pricePerHour: Double,
    location: String,
    description: String,
    imageUrls: List<String>,
    amenities: List<String>,
    onBackClick: () -> Unit,
    onBookNowClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)

    val scrollState = rememberScrollState()
    val images = if (imageUrls.isEmpty()) listOf("https://via.placeholder.com/600x400") else imageUrls
    val pagerState = rememberPagerState(pageCount = { images.size })

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
                        Text("Total Price", fontSize = 12.sp, color = Color.Gray)
                        Text("₹$pricePerHour / hr", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = brandRed)
                    }
                    Button(
                        onClick = onBookNowClick,
                        colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.height(46.dp).padding(horizontal = 8.dp)
                    ) {
                        Text("Check Availability", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
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
                HorizontalPager(
                    state = pagerState,
                    modifier = Modifier.fillMaxSize()
                ) { page ->
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
                        Surface(
                            color = brandRed.copy(alpha = 0.08f),
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                text = categoryName.uppercase(),
                                color = brandRed,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                        Text(text = venueName, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Text(text = "📍 $location", fontSize = 14.sp, color = Color.Gray)
                    }
                }

                if (amenities.isNotEmpty()) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Text("Offered Amenities", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                            LazyRow(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                items(amenities) { amenity ->
                                    Surface(
                                        color = Color(0xFFF1F5F9),
                                        shape = RoundedCornerShape(6.dp),
                                        border = androidx.compose.foundation.BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.5f))
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