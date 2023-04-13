import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
// import Checkbox from '@mui/material/Checkbox/Checkbox';
import { selectPermission } from 'app/store/permissionSlice';
import { newUser, selectUser, addUser } from '../store/userSlice';
import { selectTeams } from '../store/teamsSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().required('You must enter a email'),
});

const UserNew = (props) => {
  const user = useSelector(selectUser);
  const permission = useSelector(selectPermission);
  const teams = useSelector(selectTeams);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    // if (routeParams.id === 'new') {
    dispatch(newUser());
    // }
  }, [dispatch]);

  useEffect(() => {
    if (permission && permission.user && !permission.user.create) {
      navigate('/settings/users');
    }
  }, [permission]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    // if (routeParams.id === 'new') {
    dispatch(addUser(data.email));
    // }
  }

  // if (_.isEmpty(form) || !user) {
  //   return <FuseLoading />;
  // }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48 mt-48">
        <div className="w-full max-w-3xl">
          <Typography className="mt-12 text-4xl font-bold truncate">Add new user</Typography>

          <Divider className="mt-16 mb-24" />
        </div>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-16"
              label="Email"
              placeholder="Email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors?.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>

      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
          Cancel
        </Button>
        <Button
          className="ml-8"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Add User
        </Button>
      </Box>
    </>
  );
};

export default UserNew;
