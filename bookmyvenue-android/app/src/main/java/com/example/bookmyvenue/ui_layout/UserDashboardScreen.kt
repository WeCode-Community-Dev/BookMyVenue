package com.example.bookmyvenue.ui_layout

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
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
import com.example.bookmyvenue.data.VenueItem

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserDashboardScreen(
    venuesList: List<VenueItem>,
    categoriesList: List<String>,
    isLoggedIn: Boolean,
    userName: String,
    onVenueClick: (VenueItem) -> Unit,
    onLogoutClick: () -> Unit,
    onNavigateToLogin: () -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var menuExpanded by remember { mutableStateOf(false) }
    var selectedCategory by remember { mutableStateOf("All") }

    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF9F9F9)

    val dynamicCategories = remember(categoriesList) {
        listOf("All") + categoriesList
    }

    val filteredVenues = remember(searchQuery, selectedCategory, venuesList) {
        venuesList.filter { venue ->
            val matchesSearch = venue.name.contains(searchQuery, ignoreCase = true)
            val matchesCategory = selectedCategory == "All" || venue.category.name.equals(selectedCategory, ignoreCase = true)
            matchesSearch && matchesCategory
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
                windowInsets = WindowInsets.statusBars,
                actions = {
                    Box {
                        IconButton(onClick = { menuExpanded = true }) {
                            Icon(
                                imageVector = Icons.Default.AccountCircle,
                                contentDescription = "Profile Menu",
                                tint = brandRed,
                                modifier = Modifier.size(28.dp)
                            )
                        }

                        DropdownMenu(
                            expanded = menuExpanded,
                            onDismissRequest = { menuExpanded = false },
                            modifier = Modifier.background(Color.White)
                        ) {
                            if (isLoggedIn) {
                                DropdownMenuItem(
                                    text = {
                                        Column {
                                            Text(text = userName, color = brandDarkText)
                                            Text("Customer Account", fontSize = 11.sp, color = Color.Gray)
                                        }
                                    },
                                    onClick = {},
                                    enabled = false
                                )
                                HorizontalDivider(color = Color(0xFFF1F5F9))
                                DropdownMenuItem(
                                    text = { Text("My Bookings", color = brandDarkText) },
                                    leadingIcon = { Icon(Icons.Default.DateRange, contentDescription = "Bookings", tint = Color.Gray) },
                                    onClick = { menuExpanded = false }
                                )
                                HorizontalDivider(color = Color(0xFFF1F5F9))
                                DropdownMenuItem(
                                    text = { Text("Logout", color = brandRed) },
                                    leadingIcon = { Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = brandRed) },
                                    onClick = {
                                        menuExpanded = false
                                        onLogoutClick()
                                    }
                                )
                            } else {
                                DropdownMenuItem(
                                    text = {
                                        Column {
                                            Text("Welcome Guest", color = brandDarkText)
                                            Text("Login to book spaces", fontSize = 11.sp, color = Color.Gray)
                                        }
                                    },
                                    onClick = {},
                                    enabled = false
                                )
                                HorizontalDivider(color = Color(0xFFF1F5F9))
                                DropdownMenuItem(
                                    text = { Text("Login or Signup", color = brandRed) },
                                    leadingIcon = { Icon(Icons.Default.Person, contentDescription = "Login Action", tint = brandRed) },
                                    onClick = {
                                        menuExpanded = false
                                        onNavigateToLogin()
                                    }
                                )
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = brandDarkText
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(lightCanvasBg),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Search venues by name...", color = Color(0xFF94A3B8)) },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = brandRed) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = brandRed,
                            unfocusedBorderColor = Color(0xFFE2E8F0),
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        singleLine = true
                    )
                }
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Categories",
                        fontSize = 16.sp,
                        color = brandDarkText,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(dynamicCategories) { category ->
                            val isSelected = category == selectedCategory
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (isSelected) brandRed else Color.White)
                                    .clickable { selectedCategory = category }
                                    .padding(horizontal = 16.dp, vertical = 10.dp)
                            ) {
                                Text(
                                    text = category,
                                    fontSize = 14.sp,
                                    color = if (isSelected) Color.White else Color(0xFF64748B)
                                )
                            }
                        }
                    }
                }
            }

            if (filteredVenues.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 40.dp, start = 32.dp, end = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "No matching venues found",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = brandDarkText,
                                textAlign = TextAlign.Center
                            )
                            Text(
                                text = "We couldn't find any approved venues matching your search.",
                                fontSize = 13.sp,
                                color = Color(0xFF94A3B8),
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            } else {
                items(filteredVenues) { venue ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 4.dp)
                            .clickable { onVenueClick(venue) }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(90.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color(0xFFF1F5F9)),
                                contentAlignment = Alignment.Center
                            ) {
                                if (!venue.imageUrls.isNullOrEmpty()) {
                                    AsyncImage(
                                        model = venue.imageUrls.first(),
                                        contentDescription = "Venue Cover Image",
                                        modifier = Modifier.fillMaxSize(),
                                        contentScale = ContentScale.Crop
                                    )
                                } else {
                                    Text(
                                        text = "No Image",
                                        fontSize = 11.sp,
                                        color = Color(0xFF94A3B8),
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }

                            Column(
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(start = 16.dp),
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(
                                    text = venue.name,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = brandDarkText
                                )
                                Text(
                                    text = venue.category.name,
                                    fontSize = 13.sp,
                                    color = Color(0xFF64748B)
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "₹${venue.pricePerHour} / hour",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = brandRed
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}