import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] px-4 py-10 sm:px-6 mt-12 rounded-t-[32px]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center text-[#B5E85C]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
              </span>
              <span className="text-xl font-bold tracking-tight text-white">Sahayak</span>
            </Link>
            <p className="text-xs text-white/60 max-w-xs leading-relaxed">
              Elevating Experience & Seize Control Of Your Smart Home!
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white">Donate</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
              <Link href="#" className="hover:text-white">Education</Link>
              <Link href="#" className="hover:text-white">Social</Link>
              <Link href="#" className="hover:text-white">Medicine</Link>
              <Link href="#" className="hover:text-white">Disaster</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white">Help</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
              <Link href="#" className="hover:text-white">FAQ</Link>
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Accessibility</Link>
              <Link href="#" className="hover:text-white">Contact Us</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white">Company</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
              <Link href="#" className="hover:text-white">About Us</Link>
              <Link href="#" className="hover:text-white">Careers</Link>
              <Link href="#" className="hover:text-white">Services</Link>
              <Link href="#" className="hover:text-white">Pricing</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-6 sm:flex-row">
          <div className="text-xs text-white/60 text-center sm:text-left">
            <p>©Sahayak Inc. 2026</p>
            <p>All Rights Reserved.</p>
          </div>
          
          <div className="mt-4 flex gap-3 sm:mt-0">
            {["Instagram", "Facebook", "Twitter", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/60 hover:text-white hover:border-white/40 transition"
              >
                <span className="h-3 w-3 rounded-full bg-white/20 flex items-center justify-center text-[8px]">
                  {social.charAt(0)}
                </span>
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


