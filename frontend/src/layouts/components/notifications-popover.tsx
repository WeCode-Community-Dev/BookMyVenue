import type { IconButtonProps } from '@mui/material/IconButton';
import type { Notification as NovuNotification } from '@novu/js';

import { useNotifications } from '@novu/react/hooks';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export type NotificationsPopoverProps = IconButtonProps;

export function NotificationsPopover({ sx, ...other }: NotificationsPopoverProps) {
  const router = useRouter();

  const {
    notifications = [],
    isLoading,
    hasMore,
    readAll,
    fetchMore,
  } = useNotifications({ limit: 20 });

  const totalUnRead = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.isRead),
    [notifications]
  );

  const readNotifications = useMemo(
    () => notifications.filter((notification) => notification.isRead),
    [notifications]
  );

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    readAll();
  }, [readAll]);

  const handleClickNotification = useCallback(
    (notification: NovuNotification) => {
      if (!notification.isRead) {
        notification.read();
      }

      handleClosePopover();

      // const url = notification.redirect?.url;
      // if (!url) return;
      return

      // if (notification.redirect?.target === '_blank' || /^https?:\/\//i.test(url)) {
      //   window.open(url, notification.redirect?.target ?? '_blank');
      // } else {
      //   router.push(url);
      // }
    },
    [handleClosePopover, router]
  );

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          {isLoading && notifications.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You don&apos;t have any notifications yet
              </Typography>
            </Box>
          ) : (
            <>
              {unreadNotifications.length > 0 && (
                <List
                  disablePadding
                  subheader={
                    <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                      New
                    </ListSubheader>
                  }
                >
                  {unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={handleClickNotification}
                    />
                  ))}
                </List>
              )}

              {readNotifications.length > 0 && (
                <List
                  disablePadding
                  subheader={
                    <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                      Before that
                    </ListSubheader>
                  }
                >
                  {readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={handleClickNotification}
                    />
                  ))}
                </List>
              )}
            </>
          )}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            disableRipple
            color="inherit"
            disabled={!hasMore}
            onClick={() => fetchMore()}
          >
            {hasMore ? 'Load more' : 'No more notifications'}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: NovuNotification;
  onClick: (notification: NovuNotification) => void;
};

function getIcon(message: string) {
  if (message.includes('welcome')) return 'mdi:human-welcome'
  if (message.includes('booking') || message.includes('reservation')) return 'solar:calendar-mark-bold-duotone'
  if (message.includes('payment')) return 'solar:wallet-money-bold-duotone'
  return 'solar:bell-bing-bold-duotone'
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { avatarUrl, title } = renderContent(notification);


  return (
    <ListItemButton
      onClick={() => onClick(notification)}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.isRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Iconify
          icon={getIcon(notification.body)}
        />
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function getNotificationIcon(notification: NovuNotification) {
  const text = `${notification.subject ?? ''} ${notification.body ?? ''}`.toLowerCase();

  if (text.includes('welcome')) {
    return 'solar:hand-stars-bold-duotone';
  }
  if (text.includes('booking') || text.includes('reservation')) {
    return 'solar:calendar-mark-bold-duotone';
  }
  if (text.includes('payment') || text.includes('paid') || text.includes('refund') || text.includes('invoice')) {
    return 'solar:wallet-money-bold-duotone';
  }

  return 'solar:bell-bing-bold-duotone';
}

function renderContent(notification: NovuNotification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.subject || notification.body}
      {notification.subject && (
        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp; {notification.body}
        </Typography>
      )}
    </Typography>
  );

  return {
    avatarUrl: notification.avatar ? null : (
      <Iconify width={24} icon={getNotificationIcon(notification)} />
    ),
    title,
  };
}
