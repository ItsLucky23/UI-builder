import { useEffect, useState } from 'react';
import Navbar from "src/_components/Navbar";
import Middleware from 'src/_components/Middleware';
import initializeRouter from './Router';
import { useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHome } from '@fortawesome/free-solid-svg-icons';
import { useSession } from '../_providers/SessionProvider';
import { useMenuHandler } from './MenuHandler';
import { ConfirmMenu } from './ConfirmMenu';
import ThemeToggler from './ThemeToggler';
import { dev } from '../../config';
import { useSocketStatus } from 'src/_providers/socketStatusProvider';
import { apiRequest } from 'src/_sockets/apiRequest';
import config from "config";

const Templates = {
  dashboard: DashboardTemplate,
  home: HomeTemplate,
  plain: PlainTemplate,
}
export  type Template = 'dashboard' | 'plain' | 'home';

function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-row bg-white">
      <div className="w-full h-full flex flex-col md:flex-row">
        <Navbar/>
        <div className="md:flex-grow h-full text-black bg-blue-50">
          <Middleware>
            {children}
          </Middleware>
        </div>
      </div>
    </div>
  )
}

function HomeTemplate({ children }: { children: React.ReactNode }) {

  const router = initializeRouter();
  const location = useLocation();
  const { session } = useSession();
  const ref = useMenuHandler();

  return (
    <div className="w-full h-full overflow-hidden flex flex-col text-title text-sm md:text-lg">

      <div className='w-full flex items-center p-2 bg-container gap-4'>
        <div className='h-full flex-1 flex gap-2 items-center'>
          <div className='min-w-8 max-w-8 h-8'>
            {session && (
              <Avatar user={session} />
            )}
          </div>
          <h1 className='font-semibold text-base line-clamp-1'>{session?.name}</h1>
        </div>

        <button 
          className='p-2 bg-container2 border border-container2-border rounded-md cursor-pointer'
          onClick={() => {
            // console.log('clicked');
            if (location.pathname.startsWith('/games')) {
              ref.open(
                <ConfirmMenu
                  title="Spel verlaten?"
                  content="Weet je zeker dat je het spel wilt verlaten?"
                  resolve={(status: boolean) => {
                    if (!status) { return; }
                    ref.close();
                    router(location.pathname == '/settings' ? '/home' : '/settings')
                  }}
                />
              )
            } else {
              router(location.pathname == '/settings' ? '/home' : '/settings')
            }
          }}
        >
          <FontAwesomeIcon icon={location.pathname == '/settings' ? faHome : faGear} size='lg' />
        </button>

        <button 
          className='bg-container2 border border-container2-border rounded-md py-2 px-6 cursor-pointer font-semibold'
          onClick={() => apiRequest({ name: 'logout' })}
        >
          Uitloggen
        </button>
      </div>

      <div className='overflow-hidden w-full flex-grow'>
        <Middleware>
          {children}
        </Middleware>
      </div>

    </div>
  )
}

function PlainTemplate({ children }: { children: React.ReactNode }) {
  const { updateTheme } = ThemeToggler();

  useEffect(() => {
    updateTheme(config.defaultTheme);
    document.documentElement.classList.toggle("dark", config.defaultTheme === "dark");
  }, [location]);

  return (
    <div className="w-full h-full">
      {children}
    </div>
  )
}

export default function TemplateProvider({
  children,
  initialTemplate,
}: {
  children: React.ReactNode;
  initialTemplate: Template;
}) {
  const [template] = useState<Template>(initialTemplate);

  const TemplateComponent = Templates[template] || PlainTemplate;

  const { session } = useSession();
  const location = useLocation();
  const { updateTheme } = ThemeToggler();
  const { socketStatus } = useSocketStatus();

  useEffect(() => {
    if (session?.theme) {
      updateTheme(session.theme);
      document.documentElement.classList.toggle("dark", session.theme === "dark");
    }
  }, [session, location]);

  if (dev) {
    return (
      <div className='w-full h-full relative'>
        <div className='absolute top-2 right-2 z-50 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold'>
          Socket status: {socketStatus.self.status}
          {socketStatus.self.status === "RECONNECTING" && socketStatus.self.reconnectAttempt ? ` (attempt ${socketStatus.self.reconnectAttempt})` : ''}
        </div>
        <TemplateComponent>{children}</TemplateComponent>
      </div>
    );  
  }

  return (
    <TemplateComponent>{children}</TemplateComponent>
  );
}