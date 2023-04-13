import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import OrganizationList from './OrganizationList';
import OrganizationsHeader from './OrganizationsHeader';
import OrganizationDialog from './components/OrganizationDialog';
import reducer from './store';
import { getOrganizations } from './store/organizationsSlice';
import { getActivations } from './store/activationsSlice';
import { getPackages } from './store/packagesSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {},
  '& .FusePageSimple-sidebar': {},
  '& .FusePageSimple-leftSidebar': {},
  '& .FusePageSimple-content': {
    backgroundColor: theme.palette.background.default,
  },
}));

function OrganizationsApp() {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getOrganizations());
    dispatch(getActivations());
    dispatch(getPackages());
  }, [dispatch]);

  return (
    <>
      <Root
        header={<OrganizationsHeader />}
        content={
          <>
            <OrganizationList />
            <OrganizationDialog />
          </>
        }
        scroll={isMobile ? 'normal' : 'content'}
      />
    </>
  );
}

export default withReducer('organizationsApp', reducer)(OrganizationsApp);
