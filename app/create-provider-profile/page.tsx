import '@root/global.scss';

import { fetchPostgresExisitingUserRecord } from '@root/resolvers/PostgresResolvers';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import Page from '@components/Page';
import CreateProviderProfileSection from '@root/pages/sections/CreateProviderProfileSection';

const title = 'Nova Energy - Create a  Profile ';
const description = 'This is your profile';

function getCookies() {
  const userId = cookies().get('userId');
  const sitekey = cookies().get('sitekey');

  if (userId) {
    return NextResponse.json({ userId: userId, sitekey: sitekey });
  } else {
    return NextResponse.json({ userId: null, sitekey: null });
  }
}

export default async function ProfilePage(props) {
  const currentHeaders = headers();
  const host = currentHeaders.get('host');
  const cookie = await getCookies();
  const cookieJson = await cookie.json();

  const sitekey = cookieJson?.sitekey?.value ?? null;
  const userId = cookieJson?.userId?.value ?? null;

  if (!userId) return redirect('/app');

  const data = await Promise.all([fetchPostgresExisitingUserRecord({ sitekey, userId })]);
  const profileData = data[0]?.data?.profile ?? null;

  if (profileData?.full_name && profileData?.email) {
    redirect('/home');
  }

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/create-provider-profile">
      <CreateProviderProfileSection userId={userId} sitekey={sitekey} profileData={profileData} />
    </Page>
  );
}
