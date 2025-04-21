import { Chip, Tooltip } from "@mui/material";
import Iconify from "src/components/iconify";

const StarredChip = () => (
    <Tooltip
        title="Starred state is topic that have been marked as important by the team."
    >
        <Chip
            variant="soft"
            color="warning"
            sx={{
                padding: 1,
                marginRight: 1,
                ".MuiChip-label": {
                    display: "none"
                }
            }}
            icon={<Iconify
                icon="mdi:star"
                style={{
                    fontSize: 20,
                    margin: 0
                }}
            />}
        />
    </Tooltip>
)

export default StarredChip;