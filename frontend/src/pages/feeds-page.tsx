import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import { useArticles } from '../hooks/use-articles';
import { formatDate } from '../utils/date-util';

export function FeedsPage() {
  const {
    loading,
    articles,
    currentPage,
    totalPages,
    filterValue,
    updateArticles,
    handleRefresh,
    handleCleanup,
    handleChangeReadStatus,
    handleChangeFavoriteStatus,
    handleMarkAllAsRead,
    handleFilterArticles,
    setFilterValue,
  } = useArticles();

  // TODO: Add filtering

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container>
      <Container>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Tooltip title="Search in feeds">
              <IconButton
                color="primary"
                onClick={handleFilterArticles}
                sx={{ width: 40, height: 40 }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              size="small"
              label="Search in feeds"
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              variant="standard"
            />
          </Grid>
          <Grid item>
            <Grid container spacing={0.5} justifyContent="space-evenly">
              <Grid item>
                <ButtonGroup variant="outlined" size="small">
                  <Button onClick={handleRefresh}>Refresh</Button>
                  <Button onClick={async () => handleMarkAllAsRead(articles)}>
                    Read All
                  </Button>
                  <Button onClick={handleCleanup} color="error">
                    Cleanup
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <List>
          {articles.map((article) => (
            <ListItem key={article.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexGrow: 1,
                }}
              >
                <Link href={article.link} target="_blank" underline="hover">
                  <Typography>{article.title}</Typography>
                </Link>
                <Typography color="textDisabled">
                  {' '}
                  {formatDate(article.pubDate)}
                </Typography>
                <Chip
                  label={article.subscription.name}
                  color="primary"
                  size="small"
                ></Chip>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  variant="outlined"
                  size="small"
                  clickable={true}
                  onClick={async () => {
                    handleChangeReadStatus(article);
                  }}
                  icon={
                    article.isRead ? (
                      <MarkEmailReadIcon />
                    ) : (
                      <MarkEmailUnreadIcon />
                    )
                  }
                ></Chip>
                <Chip
                  variant="outlined"
                  size="small"
                  clickable={true}
                  onClick={async () => {
                    handleChangeFavoriteStatus(article);
                  }}
                  icon={
                    article.isFavorite ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )
                  }
                ></Chip>
              </Box>
            </ListItem>
          ))}
        </List>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={updateArticles}
          />
        </Stack>
      </Container>
    </Container>
  );
}
