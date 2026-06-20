import LoginForm from './LoginForm';

export default async function LoginPage(props) {
  const searchParams = await props.searchParams;
  const registered = searchParams.registered === 'true';

  return (
    <main className="app-container">
      <LoginForm registered={registered} />
    </main>
  );
}
