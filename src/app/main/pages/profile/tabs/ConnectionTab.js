import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import IconButton from '@mui/material/IconButton';
// import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';

import { motion } from 'framer-motion';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux';

import firebase from 'firebase/compat/app';
import { useEffect, useState } from 'react';
import { selectProfile } from '../store/profileSlice';
import { selectOrganization } from '../store/organizationsSlice';

const ConnectionTab = () => {
  // const [data, setData] = useState(null);
  const profile = useSelector(selectProfile);
  const organizations = useSelector(selectOrganization);

  // const [firebaseUser, setFirebaseUser] = useState(null);

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailUser, setEmailUser] = useState(null);
  const [facebookUser, setFacebookUser] = useState(null);

  // useEffect(() => {
  //   axios.get('/api/profile/about').then((res) => {
  //     setData(res.data);
  //   });
  // }, []);
  useEffect(() => {
    const { currentUser } = firebase.auth();
    // if (currentUser) setFirebaseUser(currentUser);
    if (currentUser.providerData) {
      currentUser.providerData.forEach((element) => {
        if (element.providerId === 'facebook.com') {
          console.log('[Facebook User] ', element);
          setFacebookUser(element);
        } else if (element.providerId === 'password') {
          console.log('[Email User] ', element);
          setEmailUser(element);
        }
      });
    }
  }, []);

  function linkFacebook() {
    const { currentUser } = firebase.auth();
    console.log('[ConnectionTab] linkFacebook ', currentUser);
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    currentUser
      .linkWithPopup(facebookProvider)
      .then((result) => {
        // Accounts successfully linked.
        const { credential } = result;
        const { user } = result;
        console.log('[linkWithPopup] user ', user);
        setFacebookUser(user.providerData.find((element) => element.providerId === 'facebook.com'));
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // ...
        console.log('[linkWithPopup] error ', error.code);
      });
  }
  function unlinkFacebook() {
    const { currentUser } = firebase.auth();
    console.log('[ConnectionTab] unlinkFacebook ', currentUser);
    // const provider = firebaseService.Providers.facebook;
    currentUser
      .unlink(facebookUser.providerId)
      .then((result) => {
        console.log('[unlink] facebook user');
        setFacebookUser(null);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // ...
        console.log('[unlinkFAcebook] error ', error);
      });
  }
  function linkEmail(data) {
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    const emailProvider = new firebase.auth.EmailAuthProvider();
    const { currentUser } = firebase.auth();
    currentUser.reauthenticateWithPopup(facebookProvider);
    const credential = emailProvider.credential(data.email, data.password);
    currentUser
      .linkWithCredential(credential)
      .then((usercred) => {
        const result = usercred.user;
        console.log('Account linking success', result);
        setEmailUser(result.providerData.find((element) => element.providerId === 'password'));
        setEmailDialogOpen(false);
      })
      .catch((error) => {
        console.log('Account linking error', error);
      });
  }
  function unlinkEmail() {
    const { currentUser } = firebase.auth();
    console.log('[ProfileContent] unlink Email ', currentUser);
    currentUser
      .unlink(emailUser.providerId)
      .then((result) => {
        console.log('[unlink] Email user');
        setEmailUser(null);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // ...
      });
  }

  // if (!profile || !organizations) {
  //   return null;
  // }

  // const { general, work, contact, groups, friends } = data;

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full">
      <div className="md:flex">
        <div className="flex flex-row flex-1">
          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="px-32 pt-24">
              <Typography className="text-2xl font-semibold leading-tight">
                Link User Account
              </Typography>
            </div>

            <CardContent className="px-32 py-24">
              <div className="flex md:flex-row flex-col p-8 w-full">
                <div className="md:px-16 py-16 w-full">
                  {emailUser !== null ? (
                    <div className="flex md:flex-row flex-col justify-between w-full">
                      <div className="flex flex-row space-x-12 md:p-24 p-4 items-center">
                        <Hidden mdDown>
                          <Avatar
                            src={profile.picture}
                            // alt={customer.name}
                            alt={emailUser.display}
                            className="w-64 h-64"
                          />
                        </Hidden>
                        <div className="flex flex-col space-y-6">
                          <Typography variant="h6">{`${emailUser.email}`}</Typography>
                          <Typography variant="subtitle2">{emailUser.email}</Typography>
                        </div>
                      </div>

                      <div className="flex flex-row space-x-12 md:p-24 p-4 items-center">
                        <Button
                          variant="outlined"
                          color="secondary"
                          disabled={!facebookUser}
                          // onClick={handleConfirmOpen('email')}

                          onClick={unlinkEmail}
                        >
                          Unlink
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center h-full">
                      <Button
                        variant="contained"
                        color="primary"
                        className="w-full md:px-16 py-16"
                        onClick={() => setEmailDialogOpen(true)}
                      >
                        Link Email
                      </Button>
                    </div>
                  )}
                </div>

                <div className="px-16 w-full">
                  {facebookUser !== null ? (
                    <div className="flex flex-row justify-between w-full">
                      <div className="flex flex-row space-x-12 p-24 items-center">
                        <Hidden mdDown>
                          <Avatar
                            src={facebookUser.pictureURL || ''}
                            // alt={customer.name}
                            alt={facebookUser.display}
                            className="w-64 h-64"
                          />
                        </Hidden>
                        <div className="flex flex-col space-y-6">
                          <Typography variant="h6">{`${facebookUser.display}`}</Typography>
                          <Typography variant="subtitle2">{facebookUser.email}</Typography>
                          {/* <Typography variant="subtitle2">{customer.channelName}</Typography> */}
                          {/* <Typography variant="caption">UUID: {customer.uid}</Typography> */}
                        </div>
                      </div>

                      <div className="flex flex-row space-x-12 p-24 items-center">
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={!emailUser}
                          // onClick={handleConfirmOpen('facebook')}

                          onClick={unlinkFacebook}
                        >
                          Unlink
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center h-full">
                      <Button
                        variant="contained"
                        color="secondary"
                        className="w-full md:mx-16 my-16"
                        onClick={linkFacebook}
                      >
                        Link Facebook
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectionTab;
