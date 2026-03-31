import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function SidebarItem({ text, icon, selected, onClick }: SidebarItemProps) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        mx: 1,
        borderRadius: 2,
        '&.Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          '& .MuiListItemIcon-root': {
            color: 'primary.contrastText',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: selected ? 'inherit' : 'text.secondary',
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}
