import { notFound } from 'next/navigation'

export default function Page() {
  // Root path has no guest ID — show 404
  notFound()
}