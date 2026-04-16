import { redirect } from 'next/navigation'

export default function Page() {
  // If someone hits the root, we redirect them to unauthorized or a specific landing.
  // Given the context of a wedding invitation, we'll send them to unauthorized
  // since they reached the site without a valid guest ID.
  redirect('/unauthorized')
}