import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, Divider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Api from "src/utils/api";

export default function Referral() {
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  useEffect(() => {
    Api.get("/account/referral/me").then((response) => {
      setReferralCode(response.referralCode);
      setReferralCount(response.referralCount);
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard");
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "75vh" }}>
      <Card sx={{ width: "500px" }}>
        <CardHeader title="Referral" />
        <CardContent>
          <Typography variant="body1">
            Invite your friends and earn extra rewards !
          </Typography>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Typography variant="body2">
            Your code :
            <TextField value={referralCode} fullWidth disabled
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: (
                  <Icon
                    style={{ cursor: "pointer" }}
                    icon="mdi:content-copy"
                    onClick={handleCopy}
                  />
                ),
              }}
            />
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Total referrals : {referralCount}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
