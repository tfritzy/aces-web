type LogoBoxProps = {
  icon: string;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const LogoBox = (props: LogoBoxProps) => {
  return (
    <button
      onClick={() => props.setIsAuthenticated(true)}
      className="flex w-46 h-10 bg-white font-sans text-sm bg-zinc-900 items-center text-white space-x-2 p-3 font-semibold"
    >
      <img src={props.icon} alt="Logo" />
      <div>Sign in with Microsoft</div>
    </button>
  );
};

type SignInProps = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const SignIn = (props: SignInProps) => {
  return (
    <div className="grid place-content-center h-screen h-48">
      <div className="flex flex-col space-y-4">
        <div className="text-3xl font-bold text-white">
          <h1>Sign In</h1>
        </div>

        <LogoBox
          icon="Logos/msft-logo.png"
          setIsAuthenticated={props.setIsAuthenticated}
        />
      </div>
    </div>
  );
};
