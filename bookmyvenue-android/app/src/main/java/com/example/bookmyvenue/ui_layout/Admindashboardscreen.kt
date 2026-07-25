package com.example.bookmyvenue.ui_layout

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bookmyvenue.data.CategoryItem
import com.example.bookmyvenue.data.HistoryBookingItemDto
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

data class AdminVenueItem(
    val id: String,
    val name: String,
    val location: String,
    val pricePerHour: Double,
    val capacity: Int,
    val description: String,
    val category: String,
    val status: String,
    val ownerName: String,
    val ownerEmail: String,
    val imageUrls: List<String> = emptyList(),
    val amenities: List<String> = emptyList()
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(
    adminName: String,
    adminEmail: String,
    pendingVenuesList: List<AdminVenueItem>,
    allVenuesList: List<AdminVenueItem>,
    categoriesList: List<CategoryItem> = emptyList(),
    allBookingsList: List<HistoryBookingItemDto> = emptyList(),
    totalRevenue: Double = 0.0,
    totalBookingsCount: Int = 0,
    onApproveVenue: (venueId: String) -> Unit = {},
    onRejectVenue: (venueId: String, reason: String) -> Unit = { _, _ -> },
    onCreateCategory: (name: String, description: String) -> Unit = { _, _ -> },
    onVenueClick: (venueId: String) -> Unit = {},
    onLogoutClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var mainNavTab by remember { mutableIntStateOf(0) }
    var activeSubScreen by remember { mutableStateOf("MAIN") }

    var showRejectDialog by remember { mutableStateOf<AdminVenueItem?>(null) }
    var rejectionReason by remember { mutableStateOf("") }

    var showAddCategoryDialog by remember { mutableStateOf(false) }
    var newCategoryName by remember { mutableStateOf("") }
    var newCategoryDesc by remember { mutableStateOf("") }

    val brandRed = Color(0xFFE51E26)
    val brandGreen = Color(0xFF10B981)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        if (activeSubScreen == "MAIN") "Admin Panel"
                        else activeSubScreen.replace("_", " "),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    if (activeSubScreen != "MAIN") {
                        IconButton(onClick = { activeSubScreen = "MAIN" }) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                        }
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White, titleContentColor = brandDarkText
                )
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color.White, tonalElevation = 0.dp) {
                NavigationBarItem(
                    selected = mainNavTab == 0 && activeSubScreen == "MAIN",
                    onClick = { mainNavTab = 0; activeSubScreen = "MAIN" },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Analytics") },
                    label = { Text("Analytics") },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed)
                )
                NavigationBarItem(
                    selected = mainNavTab == 1 || activeSubScreen != "MAIN",
                    onClick = { mainNavTab = 1; activeSubScreen = "MAIN" },
                    icon = { Icon(Icons.Default.List, contentDescription = "Operations") },
                    label = { Text("Operations") },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed)
                )
            }
        },
        floatingActionButton = {
            if (activeSubScreen == "CATEGORIES") {
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
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(lightCanvasBg)
        ) {
            when {
                activeSubScreen == "PENDING" -> {
                    AdminPendingListSection(
                        pendingList = pendingVenuesList,
                        brandRed = brandRed,
                        brandDarkText = brandDarkText,
                        onApproveClick = onApproveVenue,
                        onRejectClick = { showRejectDialog = it },
                        onCardClick = onVenueClick
                    )
                }
                activeSubScreen == "PROPERTIES" -> {
                    AdminPropertiesListSection(
                        allList = allVenuesList,
                        brandDarkText = brandDarkText,
                        onCardClick = onVenueClick
                    )
                }
                activeSubScreen == "CATEGORIES" -> {
                    AdminCategoriesListSection(
                        categoriesList = categoriesList,
                        brandDarkText = brandDarkText
                    )
                }
                activeSubScreen == "PAYMENT LEDGER" -> {
                    AdminPaymentLedgerSection(
                        bookingsList = allBookingsList,
                        brandGreen = brandGreen,
                        brandDarkText = brandDarkText
                    )
                }
                mainNavTab == 0 -> {
                    AdminAnalyticsDashboardView(
                        allBookingsList = allBookingsList,
                        totalRevenue = totalRevenue,
                        totalBookingsCount = totalBookingsCount,
                        activePropertiesCount = allVenuesList.count { it.status == "ACTIVE" },
                        pendingCount = pendingVenuesList.size,
                        categoriesCount = categoriesList.size,
                        brandRed = brandRed,
                        brandGreen = brandGreen,
                        brandDarkText = brandDarkText,
                        onNavigateToPending = { activeSubScreen = "PENDING" },
                        onNavigateToPayments = { activeSubScreen = "PAYMENT LEDGER" }
                    )
                }
                else -> {
                    AdminOperationsView(
                        adminName = adminName,
                        adminEmail = adminEmail,
                        pendingCount = pendingVenuesList.size,
                        propertiesCount = allVenuesList.size,
                        categoriesCount = categoriesList.size,
                        paymentsCount = allBookingsList.size,
                        brandRed = brandRed,
                        brandDarkText = brandDarkText,
                        onNavigate = { destination -> activeSubScreen = destination },
                        onLogoutClick = onLogoutClick
                    )
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
                        label = { Text("Category Name") },
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
fun AdminAnalyticsDashboardView(
    allBookingsList: List<HistoryBookingItemDto>,
    totalRevenue: Double,
    totalBookingsCount: Int,
    activePropertiesCount: Int,
    pendingCount: Int,
    categoriesCount: Int,
    brandRed: Color,
    brandGreen: Color,
    brandDarkText: Color,
    onNavigateToPending: () -> Unit,
    onNavigateToPayments: () -> Unit
) {
    var selectedTimeRange by remember { mutableStateOf("Weekly") }

    val confirmedBookings = remember(allBookingsList) {
        allBookingsList.filter { it.status.equals("CONFIRMED", ignoreCase = true) }
    }
    val cancelledBookings = remember(allBookingsList) {
        allBookingsList.filter { it.status.equals("CANCELLED", ignoreCase = true) }
    }

    val labels = remember(selectedTimeRange) {
        when (selectedTimeRange) {
            "Monthly" -> listOf("W1", "W2", "W3", "W4")
            "Yearly" -> listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
            else -> listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        }
    }

    val confirmedRevenues = remember(confirmedBookings, selectedTimeRange) {
        val size = labels.size
        val revenues = DoubleArray(size) { 0.0 }
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

        confirmedBookings.forEachIndexed { index, booking ->
            var bucketIndex = -1
            try {
                if (!booking.createdAt.isNullOrBlank()) {
                    val date = sdf.parse(booking.createdAt.take(10))
                    if (date != null) {
                        val cal = Calendar.getInstance().apply { time = date }
                        bucketIndex = when (selectedTimeRange) {
                            "Monthly" -> {
                                val dom = cal.get(Calendar.DAY_OF_MONTH)
                                ((dom - 1) / 7).coerceIn(0, 3)
                            }
                            "Yearly" -> {
                                cal.get(Calendar.MONTH).coerceIn(0, 11)
                            }
                            else -> {
                                val dow = cal.get(Calendar.DAY_OF_WEEK)
                                if (dow == Calendar.SUNDAY) 6 else dow - 2
                            }
                        }
                    }
                }
            } catch (_: Exception) {}

            if (bucketIndex !in 0 until size) {
                bucketIndex = index % size
            }

            revenues[bucketIndex] += booking.totalPrice
        }
        revenues
    }

    val cancelledRevenues = remember(cancelledBookings, selectedTimeRange) {
        val size = labels.size
        val revenues = DoubleArray(size) { 0.0 }
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

        cancelledBookings.forEachIndexed { index, booking ->
            var bucketIndex = -1
            try {
                if (!booking.createdAt.isNullOrBlank()) {
                    val date = sdf.parse(booking.createdAt.take(10))
                    if (date != null) {
                        val cal = Calendar.getInstance().apply { time = date }
                        bucketIndex = when (selectedTimeRange) {
                            "Monthly" -> {
                                val dom = cal.get(Calendar.DAY_OF_MONTH)
                                ((dom - 1) / 7).coerceIn(0, 3)
                            }
                            "Yearly" -> {
                                cal.get(Calendar.MONTH).coerceIn(0, 11)
                            }
                            else -> {
                                val dow = cal.get(Calendar.DAY_OF_WEEK)
                                if (dow == Calendar.SUNDAY) 6 else dow - 2
                            }
                        }
                    }
                }
            } catch (_: Exception) {}

            if (bucketIndex !in 0 until size) {
                bucketIndex = index % size
            }

            revenues[bucketIndex] += booking.totalPrice
        }
        revenues
    }

    val maxBucketRevenue = remember(confirmedRevenues, cancelledRevenues) {
        val maxVal = (confirmedRevenues.maxOrNull() ?: 0.0)
            .coerceAtLeast(cancelledRevenues.maxOrNull() ?: 0.0)
        if (maxVal == 0.0) 10000.0 else maxVal
    }

    fun formatYAxisLabel(value: Double): String {
        return when {
            value >= 1000000 -> "₹${(value / 1000000).toInt()}M"
            value >= 1000 -> "₹${(value / 1000).toInt()}k"
            else -> "₹${value.toInt()}"
        }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Net Platform Volume", fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
                            Text("₹$totalRevenue", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = brandGreen)
                        }

                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = Color(0xFFF1F5F9)
                        ) {
                            Row(modifier = Modifier.padding(4.dp)) {
                                listOf("Weekly", "Monthly", "Yearly").forEach { range ->
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(if (selectedTimeRange == range) Color.White else Color.Transparent)
                                            .clickable { selectedTimeRange = range }
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = range,
                                            fontSize = 11.sp,
                                            fontWeight = if (selectedTimeRange == range) FontWeight.Bold else FontWeight.Medium,
                                            color = if (selectedTimeRange == range) brandDarkText else Color.Gray
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f))
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Revenue Breakdown", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = brandDarkText)

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(brandGreen))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Gross", fontSize = 10.sp, color = Color.Gray)
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(brandRed))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Cancelled", fontSize = 10.sp, color = Color.Gray)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxHeight()
                                .padding(end = 8.dp),
                            verticalArrangement = Arrangement.SpaceBetween,
                            horizontalAlignment = Alignment.End
                        ) {
                            Text(formatYAxisLabel(maxBucketRevenue), fontSize = 9.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
                            Text(formatYAxisLabel(maxBucketRevenue / 2), fontSize = 9.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
                            Text("₹0", fontSize = 9.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
                        }

                        Column(modifier = Modifier.weight(1f).fillMaxHeight()) {
                            Box(modifier = Modifier.fillMaxWidth().weight(1f)) {
                                Canvas(modifier = Modifier.fillMaxSize()) {
                                    val width = size.width
                                    val height = size.height
                                    val count = labels.size
                                    val barWidth = when (selectedTimeRange) {
                                        "Yearly" -> 8.dp.toPx()
                                        "Monthly" -> 24.dp.toPx()
                                        else -> 16.dp.toPx()
                                    }
                                    val spacing = (width - (barWidth * count)) / (count + 1)

                                    val dashEffect = PathEffect.dashPathEffect(floatArrayOf(8f, 8f), 0f)

                                    drawLine(
                                        color = Color.LightGray.copy(alpha = 0.3f),
                                        start = Offset(0f, 0f),
                                        end = Offset(width, 0f),
                                        pathEffect = dashEffect
                                    )
                                    drawLine(
                                        color = Color.LightGray.copy(alpha = 0.3f),
                                        start = Offset(0f, height * 0.5f),
                                        end = Offset(width, height * 0.5f),
                                        pathEffect = dashEffect
                                    )
                                    drawLine(
                                        color = Color.LightGray.copy(alpha = 0.8f),
                                        start = Offset(0f, height),
                                        end = Offset(width, height),
                                        strokeWidth = 2f
                                    )

                                    for (i in labels.indices) {
                                        val x = spacing + i * (barWidth + spacing)
                                        val confirmedRev = confirmedRevenues[i]
                                        val cancelledRev = cancelledRevenues[i]

                                        if (confirmedRev > 0.0) {
                                            val barHeight = ((confirmedRev / maxBucketRevenue) * height).toFloat()
                                            val barTop = height - barHeight

                                            drawRoundRect(
                                                color = brandGreen.copy(alpha = 0.85f),
                                                topLeft = Offset(x, barTop),
                                                size = Size(barWidth, barHeight),
                                                cornerRadius = CornerRadius(4f, 4f)
                                            )
                                        }

                                        if (cancelledRev > 0.0) {
                                            val barHeight = ((cancelledRev / maxBucketRevenue) * height).toFloat()
                                            val confirmedBarTop = if (confirmedRev > 0.0) {
                                                height - ((confirmedRev / maxBucketRevenue) * height).toFloat()
                                            } else {
                                                height
                                            }
                                            val redTop = confirmedBarTop - barHeight - 3f

                                            drawRoundRect(
                                                color = brandRed,
                                                topLeft = Offset(x, redTop.coerceAtLeast(0f)),
                                                size = Size(barWidth, barHeight),
                                                cornerRadius = CornerRadius(3f, 3f)
                                            )
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                labels.forEach { label ->
                                    Text(label, fontSize = 9.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
                                }
                            }
                        }
                    }
                }
            }
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                MetricSummaryCard(
                    title = "Confirmed Bookings",
                    value = totalBookingsCount.toString(),
                    accentColor = brandGreen,
                    modifier = Modifier.weight(1f)
                )
                MetricSummaryCard(
                    title = "Cancelled Bookings",
                    value = cancelledBookings.size.toString(),
                    accentColor = brandRed,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                MetricSummaryCard(
                    title = "Active Properties",
                    value = activePropertiesCount.toString(),
                    accentColor = Color(0xFF3B82F6),
                    modifier = Modifier.weight(1f)
                )
                MetricSummaryCard(
                    title = "Pending Approvals",
                    value = pendingCount.toString(),
                    accentColor = brandRed,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        if (pendingCount > 0) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, brandRed.copy(alpha = 0.3f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToPending() }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Pending Verification", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandRed)
                            Text("$pendingCount venue applications awaiting review", fontSize = 12.sp, color = Color.DarkGray)
                        }
                        Icon(Icons.Default.KeyboardArrowRight, contentDescription = null, tint = brandRed)
                    }
                }
            }
        }

        item {
            Button(
                onClick = onNavigateToPayments,
                colors = ButtonDefaults.buttonColors(containerColor = brandDarkText),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth().height(48.dp)
            ) {
                Text("View Payment Ledger", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun MetricSummaryCard(
    title: String,
    value: String,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, fontSize = 11.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = accentColor)
        }
    }
}

@Composable
fun AdminOperationsView(
    adminName: String,
    adminEmail: String,
    pendingCount: Int,
    propertiesCount: Int,
    categoriesCount: Int,
    paymentsCount: Int,
    brandRed: Color,
    brandDarkText: Color,
    onNavigate: (String) -> Unit,
    onLogoutClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(50.dp)
                        .clip(CircleShape)
                        .background(brandRed.copy(alpha = 0.1f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Person, contentDescription = null, tint = brandRed)
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(adminName, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                    Text(adminEmail, fontSize = 12.sp, color = Color.Gray)
                }
            }
        }

        Text("Management Options", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.Gray)

        AdminMenuOptionCard(
            title = "Pending Verifications",
            countText = "$pendingCount Pending",
            badgeColor = brandRed,
            onClick = { onNavigate("PENDING") }
        )

        AdminMenuOptionCard(
            title = "Properties List",
            countText = "$propertiesCount Venues",
            badgeColor = Color(0xFF3B82F6),
            onClick = { onNavigate("PROPERTIES") }
        )

        AdminMenuOptionCard(
            title = "Categories Management",
            countText = "$categoriesCount Categories",
            badgeColor = Color(0xFF8B5CF6),
            onClick = { onNavigate("CATEGORIES") }
        )

        AdminMenuOptionCard(
            title = "Payment Ledger",
            countText = "$paymentsCount Receipts",
            badgeColor = Color(0xFF10B981),
            onClick = { onNavigate("PAYMENT LEDGER") }
        )

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = onLogoutClick,
            colors = ButtonDefaults.buttonColors(containerColor = brandRed),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Text("Logout", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun AdminMenuOptionCard(
    title: String,
    countText: String,
    badgeColor: Color,
    onClick: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(title, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = badgeColor.copy(alpha = 0.12f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        countText,
                        color = badgeColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
                Spacer(modifier = Modifier.width(6.dp))
                Icon(Icons.Default.KeyboardArrowRight, contentDescription = null, tint = Color.Gray)
            }
        }
    }
}

@Composable
fun AdminPendingListSection(
    pendingList: List<AdminVenueItem>,
    brandRed: Color,
    brandDarkText: Color,
    onApproveClick: (String) -> Unit,
    onRejectClick: (AdminVenueItem) -> Unit,
    onCardClick: (String) -> Unit
) {
    if (pendingList.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("All caught up! No pending applications.", color = Color.Gray, fontSize = 13.sp)
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(pendingList) { venue ->
                AdminVenueCard(
                    venue = venue,
                    brandRed = brandRed,
                    brandDarkText = brandDarkText,
                    onRejectClick = onRejectClick,
                    onApproveClick = onApproveClick,
                    onCardClick = { onCardClick(venue.id) }
                )
            }
        }
    }
}

@Composable
fun AdminPropertiesListSection(
    allList: List<AdminVenueItem>,
    brandDarkText: Color,
    onCardClick: (String) -> Unit
) {
    if (allList.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No properties exist in database.", color = Color.Gray, fontSize = 13.sp)
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(allList) { venue ->
                AdminVenueCompactCard(venue = venue, brandDarkText = brandDarkText, onCardClick = { onCardClick(venue.id) })
            }
        }
    }
}

@Composable
fun AdminCategoriesListSection(
    categoriesList: List<CategoryItem>,
    brandDarkText: Color
) {
    if (categoriesList.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No categories configured.", color = Color.Gray, fontSize = 13.sp)
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(categoriesList) { category ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth().border(0.5.dp, Color.LightGray.copy(0.4f), RoundedCornerShape(12.dp))
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(category.name, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = if (category.isListed) Color(0xFFE6F4EA) else Color(0xFFFCE8E6)
                        ) {
                            Text(
                                text = if (category.isListed) "ACTIVE" else "UNLISTED",
                                fontSize = 10.sp, fontWeight = FontWeight.Bold,
                                color = if (category.isListed) Color(0xFF137333) else Color(0xFFC5221F),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AdminPaymentLedgerSection(
    bookingsList: List<HistoryBookingItemDto>,
    brandGreen: Color,
    brandDarkText: Color
) {
    if (bookingsList.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No transaction receipts available.", color = Color.Gray, fontSize = 13.sp)
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(bookingsList) { booking ->
                ExpandableAdminPaymentCard(booking = booking, brandGreen = brandGreen, brandDarkText = brandDarkText)
            }
        }
    }
}

@Composable
fun ExpandableAdminPaymentCard(
    booking: HistoryBookingItemDto,
    brandGreen: Color,
    brandDarkText: Color
) {
    var expanded by remember { mutableStateOf(false) }

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
                    Text(text = booking.venue.name, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                    Text(text = "Booking Ref: ${booking.id.take(8).uppercase()}", fontSize = 12.sp, color = Color.Gray)
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "₹${booking.totalPrice}", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = brandGreen)
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(
                        imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = null, tint = Color.Gray, modifier = Modifier.size(20.dp)
                    )
                }
            }

            AnimatedVisibility(visible = expanded) {
                Column {
                    HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color.LightGray.copy(alpha = 0.3f))
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Booking ID:", fontSize = 11.sp, color = Color.Gray)
                            Text(booking.id.take(12).uppercase(), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Transaction ID:", fontSize = 11.sp, color = Color.Gray)
                            Text(booking.payment?.paymentId ?: "N/A", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Payment Mode:", fontSize = 11.sp, color = Color.Gray)
                            Text(booking.payment?.method ?: "ONLINE", fontSize = 11.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AdminVenueCard(
    venue: AdminVenueItem,
    brandRed: Color,
    brandDarkText: Color,
    onRejectClick: (AdminVenueItem) -> Unit,
    onApproveClick: (String) -> Unit,
    onCardClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCardClick() }
            .border(
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

@Composable
fun AdminVenueCompactCard(
    venue: AdminVenueItem,
    brandDarkText: Color,
    onCardClick: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCardClick() }
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
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = venue.name,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = brandDarkText
                    )

                    val statusColor = when (venue.status) {
                        "ACTIVE" -> Color(0xFF10B981)
                        "REJECTED" -> Color(0xFFEF4444)
                        else -> Color(0xFFF59E0B)
                    }

                    Surface(
                        color = statusColor.copy(alpha = 0.1f),
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

            Icon(
                imageVector = Icons.Default.KeyboardArrowRight,
                contentDescription = "View Details",
                tint = Color.Gray
            )
        }
    }
}