/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Typography } from '@mui/material';
import Linkify from 'react-linkify';
import { useEffect, useState } from 'react';
import extractUrls from 'extract-urls';
import { getLinkPreview } from 'link-preview-js';
import FuseUtils from '@fuse/utils/FuseUtils';

const TextViewer = (props) => {
  const { item } = props;
  const messageObj = JSON.parse(item.data);
  const [viewUrl, setViewUrl] = useState(extractUrls(messageObj.text));
  const [viewTitle, setViewTitle] = useState('');
  const [viewDescription, setViewDescription] = useState('');
  const [viewImage, setViewImage] = useState('');
  const [viewDomain, setViewDomain] = useState('');

  const text = FuseUtils.formatMentionToText(messageObj.text);

  useEffect(() => {
    if (viewUrl) {
      getLinkPreview(messageObj.text).then((data) => {
        setViewTitle(data.title);
        setViewDescription(data.description);
        setViewImage(data.images);
      });
      setViewDomain(new URL(viewUrl).hostname.replace('www.', ''));
    }
  }, [messageObj.text, viewUrl]);

  return (
    <div className="w-full">
      {/* <ReactMarkdown>{text}</ReactMarkdown> */}
      <Linkify
        componentDecorator={(decoratedHref, decoratedText, key) => (
          <a target="blank" href={decoratedHref} key={key} className="!text-[#ffffff] !font-bold">
            {decoratedText}
          </a>
        )}
      >
        <p
          className="break-words hover:break-all whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Linkify>
      {viewUrl && (
        <div className="flex flex-row max-h-96 rounded-8 bg-white">
          <div className="flex ">
            <img src={viewImage} alt="" className="max-w-96 rounded-l-8" />
          </div>
          <div className="flex flex-col grow items-center p-5 max-w-400">
            <Typography className="flex text-14 font-600 text-black truncate w-full">
              {viewTitle}
            </Typography>
            <Typography className="flex text-12 font-400 line-clamp-2 text-desc w-full place-self-start">
              {viewDescription}
            </Typography>
            <Typography className="flex text-12 font-500 text-black truncate w-full place-self-start pt-5">
              {viewDomain}
            </Typography>
          </div>
          <FuseSvgIcon
            size={20}
            color="action"
            className="flex font-600 m-5 cursor-pointer"
            onClick={() => setViewUrl(false)}
          >
            heroicons-outline:x
          </FuseSvgIcon>
        </div>
      )}
    </div>
  );
};

export default TextViewer;
