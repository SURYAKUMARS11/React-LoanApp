import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import store from '../store';
import Login from '../Components/Login';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Signup from '../Components/Signup';
import ErrorPage from '../Components/ErrorPage';
import HomePage from '../Components/HomePage';
import AdminNavbar from '../AdminComponents/AdminNavbar';
import LoanForm from '../AdminComponents/LoanForm';
import ViewLoans from '../AdminComponents/ViewLoans';
import LoanRequest from '../AdminComponents/LoanRequest';
import UserNavbar from '../UserComponents/UserNavbar';
import LoanApplicationForm from '../UserComponents/LoanApplicationForm';
import AppliedLoans from '../UserComponents/AppliedLoans';
import ViewAllLoans from '../UserComponents/ViewAllLoans';


jest.mock('axios');

// Setup QueryClient
const queryClient = new QueryClient();

describe('Login Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Login {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  
  test('frontend_login_component_renders_the_with_login_heading', () => {
    renderLoginComponent();

  
    const loginHeadings = screen.getAllByText(/Login/i);
    expect(loginHeadings.length).toBeGreaterThan(0);

  });


  test('frontend_login_component_displays_validation_messages_when_login_button_is_clicked_with_empty_fields', () => {
    renderLoginComponent();

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

   
});
describe('Signup Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSignupComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Signup {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_signup_component_renders_with_signup_heading', () => {
    renderSignupComponent();

    const signupHeadings = screen.getAllByText(/Signup/i);
   expect(signupHeadings.length).toBeGreaterThan(0);

  });

  test('frontend_signup_component_displays_validation_messages_when_submit_button_is_clicked_with_empty_fields', () => {
    renderSignupComponent();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('User Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password is required')).toBeInTheDocument();
  });

  test('frontend_signup_component_displays_error_when_passwords_do_not_match', () => {
    renderSignupComponent();

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
describe('ErrorPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderErrorComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ErrorPage {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_errorpage_component_renders_with_error_heading', () => {
    renderErrorComponent();
    const headingElement = screen.getByText(/Oops! Something Went Wrong/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('frontend_errorpage_component_renders_with_error_content', () => {
    renderErrorComponent();
    const paragraphElement = screen.getByText(/Please try again later./i);
    expect(paragraphElement).toBeInTheDocument();
  });
});
describe('Home Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderHomeComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <HomePage {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_home_component_renders_with_heading', () => {
    renderHomeComponent();
    const headingElement = screen.getAllByText(/Vehicle Loan HUB/i);
    expect(headingElement.length).toBeGreaterThan(0);

  });
  test('frontend_home_component_renders_with_contact_us', () => {
    renderHomeComponent();
    const headingElement = screen.getAllByText(/Contact Us/i);
    expect(headingElement.length).toBeGreaterThan(0);

  });
});

describe('AdminNavbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderAdminNavbarComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AdminNavbar {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_admin_navbar_component_renders_with_home', () => {
    renderAdminNavbarComponent();
    const home = screen.getAllByText('Home');
    expect(home.length).toBeGreaterThan(0);
  });

  test('frontend_admin_navbar_component_renders_with_loan_requested', () => {
    renderAdminNavbarComponent();
    const loan = screen.getAllByText('Loans Requested');
    expect(loan.length).toBeGreaterThan(0);
  });

  test('frontend_admin_navbar_component_renders_with_logout', () => {
    renderAdminNavbarComponent();
  
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

});


describe('LoanForm Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoanFormComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <LoanForm {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_loan_form_component_displays_error_when_submitting_with_empty_field', () => {
    renderLoanFormComponent();

    fireEvent.click(screen.getByRole('button', { name: /Add Loan/i }));

    expect(screen.getByText('Loan Type is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Interest Rate is required')).toBeInTheDocument();
    expect(screen.getByText('Maximum Amount is required')).toBeInTheDocument();
  });


  test('frontend_loan_form_component_renders_with_create_New_Loan_heading', () => {
    renderLoanFormComponent();

    const course = screen.getByText('Create New Loan');
    expect(course).toBeInTheDocument();
  });

  test('frontend_loan_form_component_renders_with_logout', () => {
    renderLoanFormComponent();
  
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });
});

describe('ViewLoans Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderViewLoanComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ViewLoans {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_view_loans_component_renders_with_table', () => {
    renderViewLoanComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_view_loans_component_renders_with_logout', () => {
  renderViewLoanComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_view_loans_component_renders_with_heading', () => {
    renderViewLoanComponent();
    // Check table data cells
    const heading = screen.getAllByText('Vechile Loans');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });
 });

 
describe('LoanRequest Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoanRequestComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <LoanRequest {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_loan_request_component_renders_with_table', () => {
    renderLoanRequestComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_loan_request_component_renders_with_logout', () => {
  renderLoanRequestComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_loan_request_component_renders_with_heading', () => {
    renderLoanRequestComponent();
    // Check table data cells
    const heading = screen.getAllByText('Loan Requests for Approval');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });

});

describe('UserNavbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderUserNavbarComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <UserNavbar {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_user_navbar_component_renders_with_home', () => {
    renderUserNavbarComponent();
    const home = screen.getAllByText('Home');
    expect(home.length).toBeGreaterThan(0);
  });

  test('frontend_user_navbar_component_renders_with_applied_loans', () => {
    renderUserNavbarComponent();
    const loan = screen.getAllByText('Applied Loans');
    expect(loan.length).toBeGreaterThan(0);
  });

  test('frontend_user_navbar_component_renders_with_logout', () => {
    renderUserNavbarComponent();
  
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

});

describe('LoanApplicationForm Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoanApplicationFormComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <LoanApplicationForm {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_loan_application_form_component_displays_error_when_submitting_with_empty_field', async () => {
    renderLoanApplicationFormComponent();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Add debug output to help us understand what is going wrong
    // screen.debug();

    // Wait for validation errors to appear
    await screen.findByText(/Income is required/i);
    await screen.findByText(/Model is required/i);
    await screen.findByText(/Purchase Price is required/i);
    await screen.findByText(/Address is required/i);
    await screen.findByText(/Proof is required/i);

    // Check for validation error messages
    expect(screen.getByText(/Income is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Model is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Purchase Price is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Proof is required/i)).toBeInTheDocument();
  });


  test('frontend_loan_application_form_component_renders_with_create_New_Loan_heading', () => {
    renderLoanApplicationFormComponent();

    const heading = screen.getByText(/Loan Application Form/i);
    expect(heading).toBeInTheDocument();
  });

  test('frontend_loan_application_form_component_renders_with_logout', () => {
    renderLoanApplicationFormComponent();

    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });
});


describe('AppliedLoans Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderAppliedLoansComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AppliedLoans {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_applied_loans_component_renders_with_table', () => {
    renderAppliedLoansComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_applied_loans_component_renders_with_logout', () => {
  renderAppliedLoansComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_applied_loans_component_renders_with_heading', () => {
    renderAppliedLoansComponent();
    // Check table data cells
    const heading = screen.getAllByText('Applied Loans');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });

});

describe('ViewAllLoans Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderViewAllLoansComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ViewAllLoans {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_view_all_loans_component_renders_with_table', () => {
    renderViewAllLoansComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_view_all_loans_component_renders_with_logout', () => {
  renderViewAllLoansComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_view_all_loans_component_renders_with_heading', () => {
    renderViewAllLoansComponent();
    // Check table data cells
    const heading = screen.getAllByText('Available Vehicle Loans');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });

});