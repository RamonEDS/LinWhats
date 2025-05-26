import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { name: 'Brasil', code: 'BR', flag: '🇧🇷', dialCode: '55' },
  { name: 'Estados Unidos', code: 'US', flag: '🇺🇸', dialCode: '1' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', dialCode: '351' },
  { name: 'Espanha', code: 'ES', flag: '🇪🇸', dialCode: '34' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', dialCode: '54' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱', dialCode: '56' },
  { name: 'Colômbia', code: 'CO', flag: '🇨🇴', dialCode: '57' },
  { name: 'México', code: 'MX', flag: '🇲🇽', dialCode: '52' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪', dialCode: '51' },
  { name: 'Uruguai', code: 'UY', flag: '🇺🇾', dialCode: '598' },
];

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, value, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      
      // Update phone number with new country code
      const phoneWithoutCode = value.replace(/^\+\d+/, '');
      onChange(`+${country.dialCode}${phoneWithoutCode}`);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // Remove any non-digit characters except +
      newValue = newValue.replace(/[^\d+]/g, '');
      
      // Ensure the value starts with the country code
      if (!newValue.startsWith(`+${selectedCountry.dialCode}`)) {
        newValue = `+${selectedCountry.dialCode}${newValue.replace(/^\+/, '')}`;
      }
      
      onChange(newValue);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="flex">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <input
              type="tel"
              ref={ref}
              value={value}
              onChange={handlePhoneChange}
              className={cn(
                "block w-full rounded-r-md border border-gray-300 py-2 px-3",
                "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                "disabled:opacity-50 disabled:bg-gray-50",
                error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                className
              )}
              {...props}
            />
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-gray-500 ml-auto">+{country.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;