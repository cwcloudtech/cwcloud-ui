import { useContext, Fragment } from "react";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Translate from 'react-translate-component';
import colors from "../../../Context/Colors"
import GlobalContext from "../../../Context/GlobalContext";

function InfoCard({ title, length, unitInfo}) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    return (
        <Fragment>
        <CardContent style={{ display: "flex", flexDirection: "column", alignContents: "flex-end" }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" className="greyText" gutterBottom>
                <Translate content={title} />
            </Typography>
            <Typography variant="h5" component="div" fontWeight={600} sx={{ color: colors.mainText[_mode] }}>
                {length}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary" className="greyText">
                <Translate content={unitInfo} />
            </Typography>
        </CardContent>
    </Fragment>
    );
}

export default InfoCard;
