/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

// Import images
import homeHero from "@/assets/hug-hero.png";
import signUp from "@/assets/sign-up.png";
import link from "@/assets/link.png";


const Home = () => {
  return (
    <main className="flex flex-col space-y-5">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 place-items-center">
        {/* Contact */}
        <div className="flex flex-col items-center space-y-3 text-center md:items-start md:text-start">
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
              className="px-5 py-2 text-center text-white uppercase border-2 rounded-full bg-primary border-primary hover:border-2 hover:text-primary hover:bg-transparent w-fit"
            >
              Make a move
            </Link>

            <Link
              href={"/about"}
              className="px-5 py-2 text-center uppercase border-2 rounded-full border-secondary-subtle text-secondary-subtle hover:bg-secondary-subtle hover:text-white w-fit"
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
      <section className="flex flex-col pt-10 gap-y-5">
        <h2 className="text-xl font-medium text-center text-primary md:text-2xl">
          Writing Your Heart's Desire: <br /> Our Effortless Method
        </h2>
        <p className="mt-1 text-center text-secondary">
          Let our effortless method guide you in writing your heart's desire.
        </p>

        <article className="flex flex-col space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-y-0">
            {/* Content */}
            <div className="md:order-2">
              <h3 className="uppercase text-primary md:text-xl">
                Prepare your request
              </h3>
              <ol>
                <li>Fill out our simple form with your heartfelt request.</li>
                <li>Our website generates a unique link for your proposal.</li>
                <li>Save the link and send it to your would-be partner.</li>
              </ol>
            </div>

            {/* Image */}
            <Image
              alt="ptm sign up form image"
              src={signUp}
              width={700}
              height={700}
              className="object-contain w-full h-full md:h-auto md:order-1"
              loading="lazy"
              quality={100}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-y-0">
            {/* Content */}
            <div>
              <h3 className="uppercase text-primary md:text-xl">
                Send the link to your would-be partner
              </h3>
              <ol>
                <li>
                  Share the link via email, text, or any other messaging app.
                </li>
                <li>Your partner clicks the link to view your proposal.</li>
                <li>
                  Your partner can respond with an answer, and you'll be
                  notified immediately.
                </li>
              </ol>
            </div>

            {/* Image */}
            <Image
              alt="ptm link image"
              src={link}
              width={700}
              height={700}
              className="object-contain w-full h-full md:h-auto"
              loading="lazy"
              quality={100}
            />
          </div>
        </article>
      </section>
    </main>
  );
};

export default Home;
