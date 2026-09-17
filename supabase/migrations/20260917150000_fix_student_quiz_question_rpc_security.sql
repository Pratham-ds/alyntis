-- Fix student quiz question access.
-- Students must receive question/options without correct_answer.
-- Direct SELECT access to quiz_questions remains denied by RLS.

CREATE OR REPLACE FUNCTION public.get_quiz_questions_for_student(p_quiz_id uuid)
RETURNS TABLE(
  id uuid,
  quiz_id uuid,
  question text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  sort_order integer,
  created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT
    q.id,
    q.quiz_id,
    q.question,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.sort_order,
    q.created_at
  FROM public.quiz_questions AS q
  WHERE q.quiz_id = p_quiz_id
  ORDER BY q.sort_order, q.created_at;
END;
$$;

REVOKE ALL ON FUNCTION public.get_quiz_questions_for_student(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_quiz_questions_for_student(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_quiz_questions_for_student(uuid) TO authenticated;
