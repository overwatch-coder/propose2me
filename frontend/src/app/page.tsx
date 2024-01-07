/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

// Import images
import homeHero from "@/assets/hug-hero.png";
import signUp from "@/assets/request-dark.png";
import link from "@/assets/link-real.png";

const Home = () => {
  return (
    <>
      <main className="flex flex-col space-y-5">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 place-items-center">
          {/* Contact */}
          <div className="flex flex-col items-center space-y-3 text-center md:items-start md:text-start dark:text-white">
            <h1 className="text-3xl font-bold capitalize md:text-4xl">
              Take the first step towards forever
            </h1>
            <p className="text-base md:text-lg">
              Let your love shine, even if you are shy.
              <br />
              Propose with confidence on our website.
            </p>

            {/* CTA */}
            <div className="flex items-center space-x-3">
              <Link
                href={"/request"}
                className="px-5 py-2 text-center text-white uppercase border-2 rounded-full bg-primary-main border-primary-main hover:border-2 hover:text-primary-main hover:bg-transparent w-fit"
              >
                Make a move
              </Link>

              <Link
                href={"/about"}
                className="px-5 py-2 text-center uppercase border-2 rounded-full border-secondary-subtle text-secondary-subtle hover:bg-secondary-subtle/50 hover:text-white w-fit dark:text-white dark:border-white"
              >
                About PTM
              </Link>
            </div>
          </div>

          {/* Image */}
          <Image
            alt="ptm hero image"
            src={homeHero}
            width={700}
            height={700}
            className="object-contain w-full h-full md:h-[400px]"
            loading="lazy"
            quality={100}
          />
        </section>

        {/* Description Section */}
        <section className="flex flex-col pt-10 gap-y-3">
          <h2 className="text-xl font-medium text-center text-primary-main md:text-2xl">
            Writing Your Heart's Desire: <br /> Our Effortless Method
          </h2>
          <p className="mt-1 text-center text-secondary-main dark:text-white/80 mb-4">
            Let our effortless method guide you in writing your heart's desire.
          </p>

          <article className="flex flex-col space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-y-0 md:gap-x-10">
              {/* Content */}
              <div className="md:order-2">
                <h3 className="uppercase text-primary-main md:text-xl mb-2">
                  Prepare your request
                </h3>
                <ul className="dark:text-white">
                  <li className="flex space-x-1 md:space-x-2">
                    <span>1.</span>
                    <span>
                      Fill out our simple form with your heartfelt request.
                    </span>
                  </li>
                  <li className="flex space-x-1 md:space-x-2">
                    <span>2.</span>
                    <span>
                      Our website generates a unique link for your proposal.
                    </span>
                  </li>
                  <li className="flex space-x-1 md:space-x-2">
                    <span>3.</span>
                    <span>
                      Save the link and send it to your would-be partner.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Image */}
              <Image
                alt="ptm sign up form image"
                src={signUp}
                width={700}
                height={700}
                className="object-contain w-full h-full md:h-auto md:order-1 border-2 border-secondary-subtle shadow-md"
                loading="lazy"
                quality={100}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-y-0 md:gap-x-10">
              {/* Content */}
              <div>
                <h3 className="uppercase text-primary-main md:text-xl mb-2">
                  Send the link to your would-be partner
                </h3>
                <ul className="dark:text-white">
                  <li className="flex space-x-1 md:space-x-2">
                    <span>1.</span>
                    <span>
                      Share the link via email, text, or any other messaging
                      app.
                    </span>
                  </li>
                  <li className="flex space-x-1 md:space-x-2">
                    <span>2.</span>
                    <span>
                      Your partner clicks the link to view your proposal.
                    </span>
                  </li>
                  <li className="flex space-x-1 md:space-x-2">
                    <span>3.</span>
                    <span>
                      Your partner can respond with an answer, and you'll be
                      notified immediately.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Image */}
              <Image
                alt="ptm link image"
                src={link}
                width={700}
                height={700}
                className="object-contain w-full h-full md:h-auto border-2 border-secondary-subtle shadow-md"
                loading="lazy"
                quality={100}
              />
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default Home;
