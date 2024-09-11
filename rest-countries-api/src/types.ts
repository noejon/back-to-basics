export type Region = 'africa' | 'all' | 'america' | 'asia' | 'europe' | 'oceania';

export type Country = {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  capital: string[];
  region: string;
  population: number;
};

export type Countries = Country[];