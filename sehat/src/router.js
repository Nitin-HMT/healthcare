import { createRouter, createWebHistory } from "vue-router";
import { session } from "./data/session";
import { userResource } from "@/data/user";

const routes = [
  {
    path: "/opd",
    name: "opd",
    component: () => import("@/pages/OPD/OpdDashboard.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/OPD/OpdDashboard.vue"),
  },
  // {
  //   name: 'Login',
  //   path: '/account/login',
  //   component: () => import('@/pages/Login.vue'),
  // },
  {
    name: "opd_consult",
    path: "/opd/:pat_id/:app_id",
    component: () => import("@/pages/OPD/OpdConsult.vue"),
  },
  {
    name: "pat_dash",
    path: "/pd/:pat_id",
    component: () => import("@/pages/PatientDashboard.vue"),
  },
  // {
  //   name: 'Labs',
  //   path: '/labs',
  //   component: () => import('@/pages/Labs.vue'),
  // },
  // {
  //   name: 'Booking',
  //   path: '/booking',
  //   component: () => import('@/pages/Booking.vue'),
  // },
  // {
  //   name: 'BHist',
  //   path: '/BHist',
  //   component: () => import('@/pages/Book_Hist.vue'),
  // },
  // {
  //   name: 'Nursing',
  //   path: '/nursing',
  //   component: () => import('@/pages/Nursing.vue'),
  // },
  // {
  //   name: 'Consult',
  //   path: '/consult',
  //   component: () => import('@/pages/Consult.vue'),
  // },
  // {
  //   name: 'Consult_alt',
  //   path: '/consult_alt',
  //   component: () => import('@/pages/Consult_alt.vue'),
  // },
];

let router = createRouter({
  history: createWebHistory("/sehat"),
  routes,
});

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn;
  try {
    await userResource.promise;
  } catch (error) {
    isLoggedIn = false;
  }

  if (to.name === "Login" && isLoggedIn) {
    next({ name: "Home" });
  } else if (!isLoggedIn) {
    //(to.name !== 'Login' && !isLoggedIn)
    window.location.href = "/login?redirect-to=/sehat";
  } else {
    next();
  }
});

export default router;
