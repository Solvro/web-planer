import React from 'react'
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CreateNewPlanPage from './_components/CreateNewPlanPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Kreator planu"
}

export default async function CreateNewPlan({ params }: PageProps) {
  const { id } = await params;
  if (!id || typeof id !== 'string' || id.length === 0) {
    return notFound()
  }

  return (
    <CreateNewPlanPage planId={id} />
  )
}
