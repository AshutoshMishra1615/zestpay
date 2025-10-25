import React from 'react';
import Image from 'next/image';

const benefitsData = [
  {
    title: 'Attract more talent',
    description:
      "Offering ZestPay's Instant Salary Advance makes you stand out. In a competitive market, this is the modern financial wellness benefit that top candidates are looking for.",
    imageUrl: '/bfeature1.avif',
    bgColor: 'bg-yellow-300',
  },
  {
    title: 'Increase retention',
    description:
      'Financial stress is a top reason employees leave. By providing a safe alternative to high-interest loans, you show you care about their well-being, giving them more reasons to stay.',
    imageUrl: '/bimage2.avif',
    bgColor: 'bg-yellow-300',
  },
  {
    title: 'Improve productivity',
    description:
      "Employees worried about money aren't focused. ZestPay helps solve their immediate cash flow problems, reducing absenteeism and keeping your team motivated and productive.",
    imageUrl: '/bimage3.avif',
    bgColor: 'bg-white',
  },
];

const Features2 = () => {
  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-4xl font-bold text-white mb-4">
          Benefits employees love, and employers do too
        </h2>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl">
          Greater financial flexibility improves employee well-being, and it's
          good for business.
        </p>

        <div className="flex flex-col gap-10">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-xl"
            >
              <div className="relative min-h-[350px] h-full w-full">
                <Image
                  src={benefit.imageUrl}
                  alt={benefit.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div
                className={`flex flex-col justify-center p-10 md:p-14 ${benefit.bgColor} text-gray-900`}
              >
                <h3 className="text-3xl font-semibold mb-4">
                  {benefit.title}
                </h3>
                <p className="text-lg leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features2;