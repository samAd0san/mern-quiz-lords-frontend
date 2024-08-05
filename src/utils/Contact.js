import React, { useState } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

function Contact() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "3d3a52d5-312e-4087-9e11-0b88cacdec94");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setIsSubmitting(false);

    if (data.success) {
      setIsSubmitted(true);
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setIsSubmitted(false);
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-4xl font-semibold text-center text-primary">
          Contact Us
        </h2>
        <p className="mb-8 text-center text-gray-500 sm:text-xl lg:mb-16">
          Got a technical issue? Want to send feedback about a beta feature? Or
          want us to call you back? Let us know.
        </p>

        {isSubmitting && (
          <div className="flex flex-col items-center justify-center h-full">
            <FaSpinner className="animate-spin text-6xl text-primary" />
            <p className="mt-4 text-xl">Submitting...</p>
          </div>
        )}

        {isSubmitted && (
          <div className="flex flex-col items-center justify-center h-full">
            <FaCheckCircle className="text-6xl text-green-500" />
            <p className="mt-4 text-xl">{result}</p>
          </div>
        )}

        {!isSubmitting && !isSubmitted && (
          <form onSubmit={onSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-black text-xl font-medium"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder="name@gmail.com"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-xl font-medium text-black"
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                required
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm"
                placeholder="Let us know how we can help you"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-xl font-medium text-black"
              >
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="rounded-lg px-5 py-3 text-center text-sm text-white bg-primary transition-all duration-300
              hover:bg-secondary sm:w-fit"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Contact;