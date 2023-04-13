import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import {
  AppBar,
  Autocomplete,
  Box,
  Chip,
  Fade,
  IconButton,
  Input,
  List,
  Menu,
  MenuItem,
  Paper,
  Popover,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

import { getChats, selectChats, setChatListType, setLabelFilter } from '../../store/chatsSlice';
import { selectLabels } from '../../store/labelsSlice';
import ChatListItem from './ChatListItem';
import ChatAppContext from '../../ChatAppContext';

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const TabChatList = () => {
  const dispatch = useDispatch();
  const { eventUpdate, tabHasFocus } = useContext(ChatAppContext);

  const chats = useSelector(selectChats);
  const labelOptions = useSelector(selectLabels);
  const role = useSelector(({ user }) => user.role);
  const { chatListType, labelFilter } = useSelector(({ chatApp }) => chatApp.chats);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Filter More option popover
  const [filterMenu, setFilterMenu] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterMenuClick = (event) => {
    setFilterMenu(event.currentTarget);
  };
  const filterMenuClose = () => {
    setFilterMenu(null);
  };
  // Chat list type dynamic with User Role
  const [filterList, setFilterList] = useState([]);
  // Chat list filter with search text
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (eventUpdate && eventUpdate < new Date()) {
      dispatch(getChats({}));
    }
  }, [dispatch, eventUpdate]);

  useEffect(() => {
    if (tabHasFocus) {
      dispatch(getChats({}));
    }
  }, [dispatch, tabHasFocus]);

  useEffect(() => {
    if (role) {
      if (role === 'agent') {
        dispatch(setChatListType('assignee'));
        dispatch(getChats({ type: 'assignee' }));
        setFilterList([
          { key: 'assignee', label: 'Assigned to me' },
          { key: 'mention', label: '@Mentions' },
        ]);
      } else {
        dispatch(setChatListType('active'));
        dispatch(getChats({ type: 'active' }));
        setFilterList([
          { key: 'all', label: 'All Chats' },
          { key: 'unassign', label: 'Unassigned All' },
          { key: 'active', label: 'All Active' },
          { key: 'resolve', label: 'All Resolved' },
          { key: 'followup', label: 'All Follow Up' },
          { key: 'assignee', label: 'Assigned to me' },
          { key: 'mention', label: '@Mentions' },
          { key: 'line', label: 'Channel: LINE' },
          { key: 'facebook', label: 'Channel: Facebook' },
        ]);
      }
    }
  }, [dispatch, role]);

  const handleChatListChange = (key) => {
    handleClose();
    dispatch(setChatListType(key));
    dispatch(getChats({ chatType: key }));
  };

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  const handleLabelChange = async (_, value) => {
    dispatch(setLabelFilter(value));
    dispatch(getChats({ filterLabel: value.map((el) => el.label) }));
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Box
          className="pt-16 border-b-1 h-72"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? lighten(theme.palette.background.default, 0.4)
                : lighten(theme.palette.background.default, 0.02),
          }}
        >
          <Toolbar className="flex flex-col space-y-8 px-12">
            {useMemo(
              () => (
                <div className="flex w-full justify-between space-x-8">
                  <Paper className="flex items-center w-full pl-16 pr-0 border-1 h-40 rounded-full shadow-none">
                    <FuseSvgIcon color="action" size={20}>
                      heroicons-solid:search
                    </FuseSvgIcon>

                    <Input
                      placeholder="Search chat"
                      className="flex flex-1 px-8"
                      disableUnderline
                      fullWidth
                      value={searchText}
                      inputProps={{
                        'aria-label': 'Search',
                      }}
                      onChange={handleSearchText}
                    />
                    <Tooltip
                      title={<Typography color="inherit">Filter</Typography>}
                      className="relative"
                      placement="top"
                    >
                      <IconButton
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        aria-controls={open ? 'basic-menu' : undefined}
                        className="relative"
                        onClick={handleClick}
                      >
                        <FuseSvgIcon className="text-48 text-gray-500" size={24}>
                          material-outline:sort
                        </FuseSvgIcon>
                      </IconButton>
                    </Tooltip>
                  </Paper>
                  <Tooltip title={<Typography color="inherit">Labels</Typography>} placement="top">
                    <IconButton
                      aria-label="more"
                      color="primary"
                      className="flex items-center"
                      onClick={filterMenuClick}
                    >
                      <FuseSvgIcon className="text-48 text-gray-500" size={24}>
                        material-outline:label
                      </FuseSvgIcon>
                    </IconButton>
                  </Tooltip>
                </div>
              ),
              [filterMenuClick, open, searchText]
            )}
          </Toolbar>
        </Box>
      </AppBar>
      <List className="w-full p-0 overflow-hidden">
        {useMemo(() => {
          function getFilteredArray(arr, _searchText) {
            if (_searchText.length === 0) {
              return arr;
            }
            return FuseUtils.filterArrayByString(arr, _searchText);
          }
          const filteredChatList = getFilteredArray([...chats], searchText);

          return (
            <motion.div
              className="flex flex-col flex-shrink-0 w-full min-h-px"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredChatList && filteredChatList.length > 0 ? (
                <>
                  {filteredChatList.map((chat, index) => (
                    <motion.div variants={item} key={index}>
                      <ChatListItem chat={chat} />
                    </motion.div>
                  ))}
                </>
              ) : (
                <Paper className="flex flex-1 flex-row min-h-px shadow-0">
                  <div className="flex flex-col flex-1 items-center justify-center p-24">
                    <FuseSvgIcon size={128} color="disabled">
                      heroicons-outline:chat
                    </FuseSvgIcon>
                    <Typography className="px-16 pb-24 mt-24 text-center" color="text.secondary">
                      No Chat conversation.
                    </Typography>
                  </div>
                </Paper>
              )}
            </motion.div>
          );
        }, [chats, searchText])}
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        className="absolute"
      >
        {filterList.map((element, index) => (
          <MenuItem
            key={index}
            value={element.key}
            onClick={() => {
              handleChatListChange(element.key);
            }}
          >
            {element.label}
          </MenuItem>
        ))}
      </Menu>
      <Popover
        open={Boolean(filterMenu)}
        anchorEl={filterMenu}
        onClose={filterMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <div className="flex min-w-200 max-w-xl p-12">
          <div className="flex flex-col px-8 items-start w-full">
            <Typography className="font-medium" color="primary">
              Filter by Label
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              className="w-full pt-8"
              id="tags-outlined"
              options={labelOptions}
              getOptionLabel={(option) => option.label}
              value={labelFilter}
              onChange={handleLabelChange}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} variant="outlined" placeholder="Label" multiline />
              )}
              renderTags={(tagOption, getTagProps) =>
                tagOption.map((option, index) => (
                  <Chip
                    label={option.label}
                    sx={{ borderRadius: '4px' }}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    className="w-min my-1 rounded"
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </div>
        </div>
      </Popover>
    </>
  );
};

export default TabChatList;
