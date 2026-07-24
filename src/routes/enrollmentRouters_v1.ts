import { Router, type Request, type Response } from "express";

import {
  zCourseId,
  zStudentId,
} from "../libs/zodValidators.js";

import type { Student, Course, Enrollment } from "../libs/types.js";

import { students, courses, enrollments } from "../db/db.js";

const router = Router();

router.get("/enrollments", (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId;
    const studentId = req.query.studentId;
    
    if((!studentId && !courseId) || (studentId && courseId)){
        return res.status(400).json({
            ok: false,
            message: "Please provide either studentId or courseId and not both!"
        });
    }

    if(studentId){
    let filtered_enrollment_stu = enrollments.filter(
    (student) => student.studentId === studentId
    );

    let filtered_course;
    for(let i: number = 0 ; i < filtered_enrollment_stu.length ; i++){
        filtered_course = courses.filter((c) => c.courseId === filtered_enrollment_stu[i]?.courseId);
    }

    return res.status(200).json({
        ok: true,
        course: filtered_course,
      });
    }

    const resultcourseId = zCourseId.safeParse(courseId);

    if (!resultcourseId.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: resultcourseId.error.issues[0]?.message,
      });
    }
    
    let filtered_enrollments = enrollments.filter(
    (student) => student.courseId === courseId
    );

    let filtered_students = students.filter((s) => s.studentId === filtered_enrollments[0]?.studentId);

      return res.status(200).json({
        ok: true,
        student: filtered_students,
      });
    

    }
   catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;
