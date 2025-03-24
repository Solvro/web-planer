import * as React from 'react'
import { Tailwind, Section, Text } from '@react-email/components'

export default function OTPEmail({ otp }: { otp: number }) {
  return (
    <Tailwind>
      <Section className="flex justify-center items-center w-full min-h-screen font-sans">
        <Section className="flex flex-col items-center w-76 rounded-2xl px-6 py-1 bg-gray-50">
          <Text className="text-xs font-medium text-violet-500">
            Zweryfikuj swój adres email
          </Text>
          <Text className="text-gray-500 my-0">
            Wpisz poniższy kod weryfikacyjny, aby dokończyć proces rejestracji
          </Text>
          <Text className="text-5xl font-bold pt-2">{otp}</Text>
          <Text className="text-gray-400 font-light text-xs pb-4">
            Kod wygaśnie za 15 minut
          </Text>
          <Text className="text-gray-600 text-xs">
            Jeśli nie próbowałeś się zalogować, zignoruj tę wiadomość i
            skontaktuj się z administratorem
          </Text>
        </Section>
      </Section>
    </Tailwind>
  )
}

OTPEmail.PreviewProps = {
  otp: 123456,
}
