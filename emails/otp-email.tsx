import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface OtpEmailProps {
  otp: string;
}

export function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>Twój kod logowania do Planera Solvro: {otp}</Preview>
      <Tailwind>
        <Body className="m-auto bg-zinc-100 font-sans">
          <Container className="mx-auto my-10 max-w-[480px] rounded-lg bg-white p-10">
            <Img
              src={`https://planer.solvro.pl/assets/logo/solvro_black.png`}
              width="auto"
              height="40"
              alt="Plaid"
              className="mb-8 block"
            />
            <Heading className="mb-4 mt-0 p-0 text-2xl font-bold text-zinc-900">
              Twój kod logowania
            </Heading>
            <Text className="mb-6 mt-0 text-sm text-zinc-500">
              Użyj poniższego kodu, aby zalogować się do Planera Solvro:
            </Text>
            <Section className="mb-6 rounded-lg bg-zinc-100 py-6 text-center">
              <Text className="m-0 text-4xl font-bold tracking-[8px] text-zinc-900">
                {otp}
              </Text>
            </Section>
            <Hr className="mb-6 border-zinc-200" />
            <Text className="m-0 text-xs text-zinc-400">
              Kod jest ważny przez 5 minut. <br />
              Jeśli nie próbowałeś się zalogować, zignoruj tę wiadomość.
            </Text>
          </Container>

          <Section className="text-center">
            <table className="w-full">
              <tr className="w-full">
                <td align="center">
                  <Img
                    alt="React Email logo"
                    height="auto"
                    src="https://planer.solvro.pl/assets/logo/logo_solvro_color.png"
                    width="42"
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td align="center">
                  <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
                    Koło Naukowe Solvro
                  </Text>
                  <Text className="mb-0 mt-[4px] text-[16px] leading-[24px] text-gray-500">
                    Otwieramy drzwi do świata IT.
                  </Text>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Row className="table-cell h-[44px] w-[56px] align-bottom">
                    <Column className="pr-[8px]">
                      <Link href="https://www.facebook.com/knsolvro">
                        <Img
                          alt="Facebook"
                          height="36"
                          src="https://react.email/static/facebook-logo.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="https://www.instagram.com/knsolvro/">
                        <Img
                          alt="Instagram"
                          height="36"
                          src="https://react.email/static/instagram-logo.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                  </Row>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Text className="my-[8px] text-[12px] font-medium leading-[14px] text-gray-500">
                    Zygmunta Wróblewskiego 27 | Pokój nr 4, 51-627 Wrocław
                  </Text>
                  <Text className="mb-0 mt-[4px] text-[10px] leading-[12px] text-gray-500">
                    kn.solvro@pwr.edu.pl
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}

OtpEmail.PreviewProps = {
  otp: "000000",
} as OtpEmailProps;

// eslint-disable-next-line import/no-default-export
export default OtpEmail;
