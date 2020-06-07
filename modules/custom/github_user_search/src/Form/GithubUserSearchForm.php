<?php

namespace Drupal\github_user_search\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\InvokeCommand;

/**
 * Implements a Github user search form.
 */
class GithubUserSearchForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'github_user_search';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Form wrapper.
    $form['#prefix'] = '<div id="github-user-search">';
    $form['#suffix'] = '</div>';
    // User text/search field.
    $form['user'] = [
      '#type' => 'search',
      '#title' => $this->t('Enter a user'),
      '#required' => TRUE,
    ];
    // Search button.
    $form['search'] = [
      '#type' => 'button',
      '#value' => $this->t('Search'),
      '#ajax' => [
        'callback' => [$this, 'searchUsers'],
        'event' => 'click',
        'progress' => [
          'type' => 'throbber',
          'message' => $this->t('Searching...'),
        ],
      ],
    ];
    $form['#attached']['library'][] = 'github_user_search/user_search';
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if (empty($form_state->getValue('user'))) {
      $form_state->setErrorByName('user', $this->t('Missing value.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Form does need to be submitted to the site.
  }

  /**
   * An Ajax callback.
   *
   * Invokes a jQuery function using a module library upon search.
   *
   * @param array $form
   *   Nested array of form elements that comprise the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function searchUsers(array &$form, FormStateInterface $form_state) {
    /**
     * @var object contains JSON response object for AJAX requests.
     */
    $response = new AjaxResponse();
    // Invokes the Github jQuery search - passes search query as argument.
    $response->addCommand(new InvokeCommand(NULL, 'user_search', [$form_state->getValue('user')]));
    return $response;
  }

}
