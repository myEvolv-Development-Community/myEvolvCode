WITH GAD_events AS (
	SELECT
	'Click to View' AS instructions,
	el.event_log_id,
	el.people_id,
	def.event_name,
	el.actual_date,
	ROW_NUMBER() OVER(
		PARTITION BY people_id
		ORDER BY actual_date ASC
	) sequence_order
	FROM event_log el
	LEFT JOIN outcome AS outcome ON outcome.outcome_id = el.outcome_id
	JOIN event_definition def ON def.event_definition_id = el.event_definition_id
	WHERE def.event_name = 'Manual GAD-7/PHQ-9'
	AND outcome.description = 'Complete'
	AND el.is_deleted = 0
)

, GAD_event_score_details AS (
	SELECT
	*
	FROM (
		SELECT
		gad_events.instructions,
		gad_event.people_id,
		gad_event.event_log_id,
		gad_event.actual_date,
		gad_events.event_name,
		gad_events.sequence_order,
		test_dets.question_code AS question_code,
		test_dets.score_value
		FROM event_log gad_event
		JOIN gad_events ON gad_events.event_log_id = gad_event.event_log_id
		LEFT JOIN test_details_answers_expanded_view test_dets ON test_dets.event_log_id = gad_event.event_log_id
	) tests

	PIVOT(
		MIN(score_value)
		FOR question_code
		IN (
			[GAD7Q1],
			[GAD7Q2],
			[GAD7Q3],
			[GAD7Q4],
			[GAD7Q5],
			[GAD7Q6],
			[GAD7Q7]
		)
	) AS pivot_table

)

, handle_incomplete_assessments AS (
	SELECT
	instructions,
	people_id,
	event_log_id,
	event_name,
	actual_date,
	sequence_order,
	CASE WHEN GAD7Q1 IS NULL THEN ROUND((GAD7Q2 + GAD7Q3 + GAD7Q4 + GAD7Q5 + GAD7Q6 + GAD7Q7)/6, 0) ELSE GAD7Q1 END as q1_score,
	CASE WHEN GAD7Q2 IS NULL THEN ROUND((GAD7Q1 + GAD7Q3 + GAD7Q4 + GAD7Q5 + GAD7Q6 + GAD7Q7)/6, 0) ELSE GAD7Q1 END as q2_score,
	CASE WHEN GAD7Q3 IS NULL THEN ROUND((GAD7Q1 + GAD7Q2 + GAD7Q4 + GAD7Q5 + GAD7Q6 + GAD7Q7)/6, 0) ELSE GAD7Q1 END as q3_score,
	CASE WHEN GAD7Q4 IS NULL THEN ROUND((GAD7Q1 + GAD7Q2 + GAD7Q3 + GAD7Q5 + GAD7Q6 + GAD7Q7)/6, 0) ELSE GAD7Q1 END as q4_score,
	CASE WHEN GAD7Q5 IS NULL THEN ROUND((GAD7Q1 + GAD7Q2 + GAD7Q3 + GAD7Q4 + GAD7Q6 + GAD7Q7)/6, 0) ELSE GAD7Q1 END as q5_score,
	CASE WHEN GAD7Q6 IS NULL THEN ROUND((GAD7Q1 + GAD7Q2 + GAD7Q3 + GAD7Q4 + GAD7Q5 + GAD7Q7)/6, 0) ELSE GAD7Q1 END as q6_score,
	CASE WHEN GAD7Q7 IS NULL THEN ROUND((GAD7Q1 + GAD7Q2 + GAD7Q3 + GAD7Q4 + GAD7Q5 + GAD7Q6)/6, 0) ELSE GAD7Q1 END as q7_score
	FROM GAD_event_score_details
)

, total_scores AS (
	SELECT
	instructions,
	people_id,
	event_log_id,
	event_name,
	actual_date,
	FORMAT(actual_date, 'M/d/yyyy') AS actual_date_only,
	sequence_order,
	q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score AS total_score,
	CASE
		WHEN q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score <= 4 
		THEN 'None/Minimal'
		WHEN (q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score >= 5) and (q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score <= 9)
		THEN 'Mild'
		WHEN (q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score >= 10) and (q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score <= 14)
		THEN 'Moderate'
		WHEN (q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score >= 15) and (q1_score + q2_score + q3_score + q4_score + q5_score
		+ q6_score + q7_score <= 21)
		THEN 'Severe'
	END AS total_score_interpretation,
	5 AS mild_range_marker,
	5 AS moderate_range_marker,
	5 AS severe_range_marker,
	10 as top_range_marker
	FROM handle_incomplete_assessments
)

SELECT * FROM total_scores
