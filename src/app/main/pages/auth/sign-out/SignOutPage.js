import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import axios from 'axios';
import firebase from 'firebase/compat/app';

import firebaseService from '../../../../auth/services/firebaseService';
import { useOrganization } from '../../../../organization/OrganizationContext';

const SignOutPage = () => {
  const navigate = useNavigate();
  const { setSelectOrganization } = useOrganization();
  const [timeLeft, setTimeLeft] = useState(2);

  useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then((result) => {
        axios.put(
          `/api/notification/setting`,
          { setting: { token: '' } },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${result.token}`,
            },
          }
        );
      });

    setTimeout(() => {
      setSelectOrganization();
      firebaseService.logOut();
    }, 500);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(intervalId);
    };
  }, [timeLeft]);

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="flex items-center w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img className="w-48 mx-auto" src="assets/images/logo/logo.svg" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight text-center">
            You have signed out!
          </Typography>
          <Typography className="flex justify-center mt-2 font-medium">
            Redirecting in {timeLeft} seconds
          </Typography>

          <Typography className="mt-32 text-md font-medium text-center" color="text.secondary">
            <span>Go to</span>
            <Link className="ml-4" to="/sign-in">
              sign in
            </Link>
          </Typography>
        </div>
      </Paper>
    </div>
  );
};

export default SignOutPage;
