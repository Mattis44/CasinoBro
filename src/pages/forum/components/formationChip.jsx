import { Chip, Tooltip } from "@mui/material";
import Iconify from "src/components/iconify";

const FormationChip = () => (
    <Tooltip
        title="Formations are topics that have been submitted as a formation by the creator and marked as validated by the team."
    >
        <Chip
            variant="soft"
            color="error"
            sx={{
                padding: 1,
                marginRight: 1,
                ".MuiChip-label": {
                    display: "none"
                }
            }}
            icon={<Iconify
                icon="material-symbols:school"
                style={{
                    fontSize: 20,
                    margin: 0
                }}
            />}
        />
    </Tooltip>
)

export default FormationChip;