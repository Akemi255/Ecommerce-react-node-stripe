import { Box, Link, Tooltip } from "@mui/material";
import '../../styles/scss/footer/footer.scss'; 

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
    const socialMedias = [
        { url: "/", icon: <FacebookIcon/>, toolTip: "Facebook" },
        { url: "/", icon: <InstagramIcon/>, toolTip: "Instagram" },
        { url: "/", icon: <LinkedInIcon/>, toolTip: "Linkedin" },
        { url: "/", icon: <TwitterIcon/>, toolTip: "Twitter" },
        { url: "/", icon: <YouTubeIcon/>, toolTip: "Youtube" },
    ];

    return (
        <Box component="footer" className="footer">
            <Box className="footer__groups">
                <Box>
                    <h4 className="footer__groups__title">Legales</h4>
                    <Box className="footer__groups__list footer__groups__list--legal">
                        <Link target="_blank" href="https://drive.google.com/file/d/1LxznSfufekiDoX2LKYDMS1uiqZVlpD0u/view">Términos y condiciones</Link>
                    </Box>
                </Box>

                <Box>
                    <h4 className="footer__groups__title">Sociales</h4>
                    <Box className="footer__groups__list footer__groups__list--social-media">
                        {socialMedias.map((socialMedia, index) => (
                            <Tooltip key={index} title={socialMedia.toolTip}>
                                <Link href={socialMedia.url}>{socialMedia.icon}</Link>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box className="footer__copyright">
                <span>&copy;2024 Todos los derechos reservados</span>
            </Box>
        </Box>
    );
};

export default Footer;
