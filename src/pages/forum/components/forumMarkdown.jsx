import PropTypes from "prop-types";

import {Link} from "@mui/material";
import Typography from "@mui/material/Typography";
import Markdown from "react-markdown";

export const ForumMarkdown = ({content}) => (
      <Markdown
        children={content}
        components={{
          h1: ({ node, ...props }) => <Typography variant="h4" sx={{ fontSize: '24px', marginBottom: '10px', borderBottom: '1px solid #23282f' }} {...props} />,
          h2: ({ node, ...props }) => <Typography variant="h5" style={{ fontSize: '20px', marginBottom: '10px', borderBottom: '1px solid #23282f' }} {...props} />,
          h3: ({ node, ...props }) => <Typography variant="h6" style={{ fontSize: '18px', marginBottom: '10px', borderBottom: '1px solid #23282f' }} {...props} />,
          h4: ({ node, ...props }) => <Typography variant="subtitle1" style={{ fontSize: '16px', marginBottom: '10px', borderBottom: '1px solid #23282f' }} {...props} />,
          h5: ({ node, ...props }) => <Typography variant="subtitle2" style={{ fontSize: '14px', marginBottom: '10px', borderBottom: '1px solid #23282f' }} {...props} />,
          h6: ({ node, ...props }) => <Typography variant="body1" style={{ fontSize: '14px', marginBottom: '10px', borderBottom: '1px solid #ccc' }} {...props} />,
          p: ({ node, ...props }) => <Typography variant="body1" style={{ fontSize: '14px', marginTop: '10px' }} {...props} />,
          a: ({ node, ...props }) => <Link style={{ fontSize: '14px', marginTop: '10px' }} {...props} />,
          ul: ({ node, ...props }) => <Typography component="ul" style={{ fontSize: '14px', marginTop: '10px', listStyleType: 'disc' }} {...props} />,
          ol: ({ node, ...props }) => <Typography component="ol" style={{ fontSize: '14px', marginTop: '10px', listStyleType: 'decimal' }} {...props} />,
          li: ({ node, ...props }) => <Typography component="li" style={{ fontSize: '14px', marginTop: '10px', listStyleType: 'disc' }} {...props} />,
          blockquote: ({ node, ...props }) => <blockquote style={{ fontSize: '14px', marginTop: '10px' }} {...props} />,
          code: ({ node, ...props }) => <code style={{ fontSize: '14px', marginTop: '10px' }} {...props} />,
          pre: ({ node, ...props }) => <pre style={{ fontSize: '14px', marginTop: '10px' }} {...props} />,
          img: ({ node, ...props }) => <img alt="img" style={{ fontSize: '14px', marginTop: '10px' }} {...props} />,
        }}
      />
    );

ForumMarkdown.propTypes = {
  content: PropTypes.string,
}
