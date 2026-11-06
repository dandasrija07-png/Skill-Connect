import { STORAGE_KEYS, getItem, setItem } from "../utils/storage";
import { initialReviews } from "../data/mockData";
import { api } from "./api";

const normalizeReview = (r) => {
  if (!r) return null;
  const reviewerObj = typeof r.reviewer === "object" && r.reviewer !== null ? r.reviewer : null;
  const skillObj = typeof r.skill === "object" && r.skill !== null ? r.skill : null;

  return {
    id: r._id || r.id,
    _id: r._id || r.id,
    skillId: skillObj?._id || r.skill || r.skillId,
    skillTitle: skillObj?.title || r.skillTitle || "Skill Review",
    sessionId: r.session?._id || r.session || r.sessionId || null,
    teacherId: r.teacher?._id || r.teacher || r.teacherId,
    reviewerId: reviewerObj?._id || r.reviewer || r.reviewerId,
    reviewerName: reviewerObj?.fullName || r.reviewerName || "Learner",
    reviewerAvatar: reviewerObj?.profileImage || r.reviewerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
    rating: Number(r.rating) || 5,
    date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : r.date || "Recent",
    comment: r.comment || "",
    teacherResponse: r.teacherResponse || null
  };
};

export const reviewService = {
  async getAllReviews() {
    let list = getItem(STORAGE_KEYS.REVIEWS);
    if (!list || !Array.isArray(list)) {
      list = initialReviews;
      setItem(STORAGE_KEYS.REVIEWS, list);
    }
    return list.map(normalizeReview);
  },

  async getReviewsForTeacher(teacherId) {
    try {
      const res = await api.get(`/reviews/teacher/${teacherId}`);
      if (res?.data && res.data.length > 0) {
        return res.data.map(normalizeReview);
      }
    } catch {
      // Offline fallback
    }

    const list = await this.getAllReviews();
    return list.filter((r) => r.teacherId === teacherId);
  },

  async getReviewsForSkill(skillId) {
    try {
      const res = await api.get(`/reviews/skill/${skillId}`);
      if (res?.data && res.data.length > 0) {
        return res.data.map(normalizeReview);
      }
    } catch {
      // Offline fallback
    }

    const list = await this.getAllReviews();
    return list.filter((r) => r.skillId === skillId);
  },

  async createReview(data) {
    try {
      const payload = {
        teacherId: data.teacherId,
        skillId: data.skillId,
        sessionId: data.sessionId || undefined,
        rating: data.rating,
        comment: data.comment
      };

      const res = await api.post("/reviews", payload);
      if (res?.data) {
        return normalizeReview(res.data);
      }
    } catch {
      // Offline fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = await this.getAllReviews();

    const duplicate = list.some(
      (r) => r.reviewerId === data.reviewerId && r.skillId === data.skillId && r.sessionId === data.sessionId
    );

    if (duplicate && data.sessionId) {
      throw new Error("You have already reviewed this learning session.");
    }

    const newRev = normalizeReview({
      id: `rev-${Date.now()}`,
      skillId: data.skillId,
      skillTitle: data.skillTitle,
      sessionId: data.sessionId || null,
      teacherId: data.teacherId,
      reviewerId: data.reviewerId,
      reviewerName: data.reviewerName,
      reviewerAvatar: data.reviewerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
      rating: Number(data.rating) || 5,
      date: new Date().toISOString().split("T")[0],
      comment: data.comment,
      teacherResponse: null
    });

    const updated = [newRev, ...list];
    setItem(STORAGE_KEYS.REVIEWS, updated);
    return newRev;
  },

  async addTeacherResponse(reviewId, responseText) {
    try {
      const res = await api.post(`/reviews/${reviewId}/response`, { response: responseText });
      if (res?.data) {
        return normalizeReview(res.data);
      }
    } catch {
      // Offline fallback
    }

    const list = await this.getAllReviews();
    const review = list.find((r) => r.id === reviewId || r._id === reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    review.teacherResponse = responseText;
    setItem(STORAGE_KEYS.REVIEWS, list);
    return review;
  }
};
