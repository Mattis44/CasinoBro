import { useNavigate } from 'react-router';
import { Card, Stack, Button, CardHeader, CardContent } from '@mui/material';
import { TypewriterEffectSmooth } from 'src/components/ui/typewriter-effect';
import Spline from '@splinetool/react-spline';

export default function Home() {
  const navigate = useNavigate();

  const words = [
    { text: 'Share' },
    { text: 'your' },
    { text: 'invest' },
    { text: 'with' },
    {
      text: 'InvestBox.',
      className: 'text-blue-500 dark:text-purple-500',
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10"
        style={{
          left: '30%',
          top: '40%',
        }}>
        <Spline scene="https://prod.spline.design/2gC0mh4oMQhOJbkK/scene.splinecode" />
      </div>
      <div className="flex flex-col items-center justify-center h-[40rem] relative z-10 text-center">
        <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base mb-4">
          Join the community and
        </p>
        <TypewriterEffectSmooth words={words} />
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="mt-6"
          onClick={() => {
            navigate('/app');
          }}
        >
          Get Started
        </Button>
      </div>

      <Stack direction="row" spacing={2} className="relative z-10 px-8 py-12">
        <Card>
          <CardHeader title="Tracking" />
          <CardContent>
            <p>You can easily track Actions, Cryptos and ETF. Powered by an API.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Forum" />
          <CardContent>
            <p>Join the community, discuss about investments and never stop learning !</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Formations" />
          <CardContent>
            <p>Learn more about investments with our free formations, easily accessible.</p>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}
