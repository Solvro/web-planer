import * as React from 'react'
import {
  Tailwind,
  Section,
  Text,
  Container,
  Heading,
  Link,
  Hr,
  Img,
} from '@react-email/components'

export default function NotificationsEmail({
  notificationsList,
}: {
  notificationsList: string[]
}) {
  return (
    <Tailwind>
      <Section className="font-sans leading-relaxed text-gray-800">
        <Container>
          <Heading as="h2" className="text-blue-700">
            Nastąpiły zmiany w blokach zajęciowych
          </Heading>
          {notificationsList.map((notification, index) => (
            <Text key={index} className="text-gray-800 my-2">
              {notification}
            </Text>
          ))}
          <Hr className="border-t border-gray-300 my-5" />
          <Text className="text-left">
            <Link
              href="https://planer.solvro.pl"
              className="text-blue-700 font-bold"
            >
              Dokonaj zmian w swoim kreatorze!
            </Link>
          </Text>
          <Img
            src="https://planer.solvro.pl/assets/logo/logo_solvro_color.png"
            alt="Logo Planer"
            className="mt-2 size-[50px] h-auto"
          />
          <Text className="text-gray-800 font-bold">Zespół Planera</Text>
        </Container>
      </Section>
    </Tailwind>
  )
}

NotificationsEmail.PreviewProps = {
  notificationsList: [
    'Zajęcia z matematyki zostały przeniesione na poniedziałek',
    'Zajęcia z fizyki zostały odwołane',
  ],
}
