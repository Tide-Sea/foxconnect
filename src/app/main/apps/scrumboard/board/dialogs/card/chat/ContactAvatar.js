import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

function icon(props) {
  switch (props.channel) {
    case 'line':
      return 'assets/images/logo/LINE.png';
    case 'facebook':
      return 'assets/images/logo/Facebook.png';
    default:
      return null;
  }
}

const ContactAvatar = ({ contact, channel, className }) => {
  return (
    // <div className={className}>
    //   <div className="absolute right-0 bottom-0 -m-4 z-10">
    //     {channel && <SocialIcon channel={channel.channel} />}
    //   </div>

    //   <Avatar src={contact.pictureURL} alt={contact.display} className="w-full h-full" />
    // </div>
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        channel.channel === 'line' ? (
          <SmallAvatar alt={channel.channel} src="assets/images/logo/LINE.png" />
        ) : (
          <SmallAvatar alt={channel.channel} src="assets/images/logo/Facebook.png" />
        )
      }
    >
      <Avatar src={contact.pictureURL} alt={contact.display} sx={{ width: 48, height: 48 }} />
    </Badge>
  );
};

export default ContactAvatar;
