-- Create table for survey responses
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('gravida', 'pos-parto')),
  services TEXT[] NOT NULL DEFAULT '{}',
  others_service TEXT,
  current_solution TEXT NOT NULL CHECK (current_solution IN ('salao', 'conhecido', 'nao-contrato')),
  priorities TEXT NOT NULL CHECK (priorities IN ('preco', 'seguranca', 'facilidade', 'variedade')),
  help_needs TEXT[] NOT NULL DEFAULT '{}',
  others_help TEXT,
  interest TEXT NOT NULL CHECK (interest IN ('sim', 'talvez', 'nao')),
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (since it's a public survey)
CREATE POLICY "Allow public insert for survey responses" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow admin select (for dashboard viewing)
-- For now we'll use a simple policy that allows all reads
-- Later this can be restricted to authenticated admin users
CREATE POLICY "Allow read access for survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON public.survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on created_at queries
CREATE INDEX idx_survey_responses_created_at ON public.survey_responses(created_at DESC);