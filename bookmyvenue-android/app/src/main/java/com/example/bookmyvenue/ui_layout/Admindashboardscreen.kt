package com.example.bookmyvenue.ui_layout

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bookmyvenue.data.CategoryItem

data class AdminVenueItem(
    val id: String,
    val name: String,
    val location: String,
    val pricePerHour: Double,
    val capacity: Int,
    val description: String,
    val category: String,
    val status: String,
    val ownerName: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(
    adminName: String,
    pendingVenuesList: List<AdminVenueItem>,
    allVenuesList: List<AdminVenueItem>,
    categoriesList: List<CategoryItem> = emptyList(),
    onApproveVenue: (venueId: String) -> Unit = {},
    onRejectVenue: (venueId: String, reason: String) -> Unit = { _, _ -> },
    onCreateCategory: (name: String, description: String) -> Unit = { _, _ -> },
    onLogoutClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableStateOf(0) }
    var showRejectDialog by remember { mutableStateOf<AdminVenueItem?>(null) }
    var rejectionReason by remember { mutableStateOf("") }

    var showAddCategoryDialog by remember { mutableStateOf(false) }
    var newCategoryName by remember { mutableStateOf("") }
    var newCategoryDesc by remember { mutableStateOf("") }

    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Admin Panel", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
                windowInsets = WindowInsets.statusBars,
                actions = {
                    IconButton(onClick = onLogoutClick) {
                        Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = brandRed)
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White, titleContentColor = brandDarkText
                )
            )
        },
        floatingActionButton = {
            if (selectedTab == 2) {
                FloatingActionButton(
                    onClick = { showAddCategoryDialog = true },
                    containerColor = brandRed,
                    contentColor = Color.White
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add Category")
                }
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Column(modifier = Modifier.fillMaxSize().padding(innerPadding).background(lightCanvasBg)) {
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                containerColor = Color.White,
                contentColor = brandRed,
                edgePadding = 0.dp,
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        Modifier.tabIndicatorOffset(tabPositions[selectedTab]), color = brandRed
                    )
                }
            ) {
                Tab(
                    selected = selectedTab == 0, onClick = { selectedTab = 0 },
                    text = { Text("Pending (${pendingVenuesList.size})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                    selectedContentColor = brandRed, unselectedContentColor = Color.Gray
                )
                Tab(
                    selected = selectedTab == 1, onClick = { selectedTab = 1 },
                    text = { Text("Properties (${allVenuesList.size})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                    selectedContentColor = brandDarkText, unselectedContentColor = Color.Gray
                )
                Tab(
                    selected = selectedTab == 2, onClick = { selectedTab = 2 },
                    text = { Text("Categories (${categoriesList.size})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                    selectedContentColor = brandDarkText, unselectedContentColor = Color.Gray
                )
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                if (selectedTab == 2) {
                    if (categoriesList.isEmpty()) {
                        item {
                            EmptyStateCard(title = "No Categories Yet", subtitle = "Click the + button below to create the first venue category.")
                        }
                    } else {
                        items(categoriesList) { category ->
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                modifier = Modifier.fillMaxWidth().border(1.dp, Color.LightGray.copy(0.3f), RoundedCornerShape(12.dp))
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(category.name, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = if (category.isListed) Color(0xFFE6F4EA) else Color(0xFFFCE8E6)
                                    ) {
                                        Text(
                                            text = if (category.isListed) "LISTED" else "UNLISTED",
                                            fontSize = 10.sp, fontWeight = FontWeight.Bold,
                                            color = if (category.isListed) Color(0xFF137333) else Color(0xFFC5221F),
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                } else {
                    val targetList = if (selectedTab == 0) pendingVenuesList else allVenuesList
                    if (targetList.isEmpty()) {
                        item {
                            EmptyStateCard(
                                title = if (selectedTab == 0) "All Caught Up!" else "No System Venues",
                                subtitle = if (selectedTab == 0) "There are no incoming verification applications." else "No venues exist in the database."
                            )
                        }
                    } else {
                        items(targetList) { venue ->
                            AdminVenueCard(venue, brandRed, brandDarkText, onRejectClick = { showRejectDialog = it }, onApproveClick = { onApproveVenue(it) })
                        }
                    }
                }
            }
        }
    }

    if (showAddCategoryDialog) {
        AlertDialog(
            onDismissRequest = { showAddCategoryDialog = false; newCategoryName = ""; newCategoryDesc = "" },
            title = { Text("Create Category", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = newCategoryName, onValueChange = { newCategoryName = it },
                        label = { Text("Category Name (e.g. Banquet Hall)") },
                        modifier = Modifier.fillMaxWidth(), singleLine = true
                    )
                    OutlinedTextField(
                        value = newCategoryDesc, onValueChange = { newCategoryDesc = it },
                        label = { Text("Description (Optional)") },
                        modifier = Modifier.fillMaxWidth().height(90.dp)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newCategoryName.isNotBlank()) {
                            onCreateCategory(newCategoryName, newCategoryDesc)
                            showAddCategoryDialog = false
                            newCategoryName = ""; newCategoryDesc = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                ) { Text("Create", color = Color.White) }
            },
            dismissButton = {
                TextButton(onClick = { showAddCategoryDialog = false; newCategoryName = ""; newCategoryDesc = "" }) {
                    Text("Cancel", color = Color.Gray)
                }
            },
            containerColor = Color.White
        )
    }

    if (showRejectDialog != null) {
        AlertDialog(
            onDismissRequest = { showRejectDialog = null; rejectionReason = "" },
            title = { Text("Rejection Feedback", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
            text = {
                OutlinedTextField(
                    value = rejectionReason, onValueChange = { rejectionReason = it },
                    placeholder = { Text("Enter reason for rejection") },
                    modifier = Modifier.fillMaxWidth().height(90.dp)
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (rejectionReason.isNotBlank()) {
                            onRejectVenue(showRejectDialog!!.id, rejectionReason)
                            showRejectDialog = null; rejectionReason = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                ) { Text("Confirm Rejection", color = Color.White) }
            },
            dismissButton = {
                TextButton(onClick = { showRejectDialog = null; rejectionReason = "" }) { Text("Cancel", color = Color.Gray) }
            },
            containerColor = Color.White
        )
    }
}

@Composable
fun EmptyStateCard(title: String, subtitle: String) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(top = 40.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A1A1A))
            Text(subtitle, fontSize = 13.sp, color = Color.Gray, textAlign = TextAlign.Center)
        }
    }
}

@Composable
fun AdminVenueCard(
    venue: AdminVenueItem,
    brandRed: Color,
    brandDarkText: Color,
    onRejectClick: (AdminVenueItem) -> Unit,
    onApproveClick: (String) -> Unit
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = Modifier.fillMaxWidth().border(
            1.dp,
            when (venue.status) {
                "ACTIVE" -> Color(0xFF10B981).copy(0.3f)
                "PENDING" -> Color(0xFFF59E0B).copy(0.3f)
                else -> brandRed.copy(0.3f)
            },
            RoundedCornerShape(12.dp)
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(venue.name, fontSize = 16.sp, color = brandDarkText, fontWeight = FontWeight.Bold)
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

            Spacer(Modifier.height(10.dp))
            HorizontalDivider(color = Color.LightGray.copy(0.3f))
            Spacer(Modifier.height(10.dp))

            Text("Category: ${venue.category}", fontSize = 13.sp, color = Color.Gray)
            Text("Location: ${venue.location}", fontSize = 13.sp, color = Color.Gray)

            Spacer(Modifier.height(6.dp))
            Text("₹${venue.pricePerHour} / hr", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = brandRed)

            if (venue.status == "PENDING") {
                Spacer(Modifier.height(14.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedButton(
                        onClick = { onRejectClick(venue) }, modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = brandRed),
                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp)
                    ) { Text("Reject", fontWeight = FontWeight.Bold) }

                    Button(
                        onClick = { onApproveClick(venue.id) }, modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                    ) { Text("Approve", color = Color.White, fontWeight = FontWeight.Bold) }
                }
            }
        }
    }
}